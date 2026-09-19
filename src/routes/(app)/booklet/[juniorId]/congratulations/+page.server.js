import { fail, redirect } from "@sveltejs/kit";
import { getValidAdminModeSession } from "$lib/server/adminMode";


const findNextStripe = async (supabase, currentStripeName) => {

    //look  for current stripe number 
    const { data: currentStripe, error: currentStripeError } = await supabase
        .from("stripes")
        .select("stripe_order")
        .ilike("stripe_name", currentStripeName)
        .single();

    if (currentStripeError || !currentStripe) {
        return null;
    }

    // Find the stripe with the next highest order number
    const { data: nextStripe, error: nextStripeError } = await supabase
        .from("stripes")
        .select("stripeName:stripe_name")
        .gt("stripe_order", currentStripe.stripe_order)
        .order("stripe_order", { ascending: true })
        .limit(1)
        .single();

    if (nextStripeError || !nextStripe) {
        return null;
    }

    return nextStripe;
}


// Get the junior's info and the stripe they would move to next
export const load = async ({ locals, params, cookies }) => {

    // Require a valid, non-expired Admin Mode session to view this page
    const adminSession = await getValidAdminModeSession({ locals, cookies });

    if (!adminSession) {
        throw redirect(303, `/booklet/${params.juniorId}`);
    }

    // Get the junior
    const { data: junior, error: juniorError } = await locals.supabase
        .from("Junior")
        .select("firstName:first_name, lastName:last_name, currentStripe:current_stripe")
        .eq("junior_id", params.juniorId)
        .single();

    if (juniorError || !junior) {
        return {
            junior: null,
            nextStripe: null,
        };
    }

    // Work out the next stripe (null if there isn't one)
    const nextStripe = await findNextStripe(locals.supabase, junior.currentStripe);

    return {
        junior,
        nextStripe,
    };
};


export const actions = {
    default: async ({ locals, params, cookies }) => {

        // Require a valid, non-expired Admin Mode session to perform the upgrade
        const adminSession = await getValidAdminModeSession({ locals, cookies });

        if (!adminSession) {
            return fail(401, {
                message: "Admin Mode session expired or missing.",
            });
        }

        try {
            const juniorId = params.juniorId;

            // Get the junior's current stripe
            const { data: junior, error: juniorError } = await locals.supabase
                .from("Junior")
                .select("current_stripe")
                .eq("junior_id", juniorId)
                .single();

            if (juniorError || !junior) {
                return fail(404, {
                    message: "Could not find junior.",
                });
            }

            // Work out the next stripe. 
            const nextStripe = await findNextStripe(locals.supabase, junior.current_stripe);

            if (!nextStripe) {
                return fail(400, {
                    message: "There is no next stripe.",
                });
            }

            // Move the junior to the next stripe
            const { error: updateError } = await locals.supabase
                .from("Junior")
                .update({
                    current_stripe: nextStripe.stripeName,
                })
                .eq("junior_id", juniorId);

            if (updateError) {
                console.error(updateError);
                return fail(500, {
                    message: "Could not update stripe.",
                });
            }

            // Remove the Admin Mode session that was used for this upgrade
            const { error: sessionError } = await locals.supabase
                .from("admin_mode_sessions")
                .delete()
                .eq("id", adminSession.id);

            if (sessionError) {
                console.error(sessionError);
                return fail(500, {
                    message: "Could not exit Admin Mode.",
                });
            }

            // Remove the Admin Mode cookie
            cookies.delete("admin_mode_session", {
                path: "/",
            });
        } catch (error) {
            console.error("Start Next Stripe error:", error);

            return fail(500, {
                message: "Something went wrong. Please try again.",
            });
        }

        throw redirect(303, `/booklet/${params.juniorId}`);
    },
};