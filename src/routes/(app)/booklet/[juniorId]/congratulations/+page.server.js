import { fail, redirect } from "@sveltejs/kit";
import { getValidAdminModeSession } from "$lib/server/adminMode";

//get junior current info and the next stripe 
export const load = async ({ locals, params, cookies }) => {
    // Require a valid, non-expired Admin Mode session to view this page
    const adminSession = await getValidAdminModeSession({ locals, cookies });

    if (!adminSession) {
        throw redirect(303, `/booklet/${params.juniorId}`);
    }



    // Get the junior
    const { data: junior, error: juniorError } = await locals.supabase
        .from("Junior")
        .select(
            "firstName:first_name, lastName:last_name, currentStripe:current_stripe",
        )
        .eq("junior_id", params.juniorId)
        .single();

    if (juniorError || !junior) {
        return {
            junior: null,
            nextStripe: null,
        };
    }

    // Get the current stripe order
    const { data: currentStripe, error: currentStripeError } =
        await supabase
            .from("stripes")
            .select("stripe_order")
            .ilike("stripe_name", junior.currentStripe)
            .single();

    if (currentStripeError || !currentStripe) {
        return {
            junior,
            nextStripe: null,
        };
    }

    // Get the next stripe
    const { data: nextStripe, error: nextStripeError } =
        await supabase
            .from("stripes")
            .select("stripeName: stripe_name")
            .gt("stripe_order", currentStripe.stripe_order)
            .order("stripe_order", { ascending: true })
            .limit(1)
            .single();

    if (nextStripeError || !nextStripe) {
        return {
            junior,
            nextStripe: null,
        };
    }

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

            // Get the current junior
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

            // Get the next stripe
            const { data: nextStripe, error: stripeError } =
                await supabase
                    .from("stripes")
                    .select("stripe_name")
                    .gt(
                        "stripe_order",
                        (
                            await supabase
                                .from("stripes")
                                .select("stripe_order")
                                .eq("stripe_name", junior.current_stripe)
                                .single()
                        ).data?.stripe_order ?? 0,
                    )
                    .order("stripe_order", { ascending: true })
                    .limit(1)
                    .single();

            if (stripeError || !nextStripe) {
                return fail(400, {
                    message: "There is no next stripe.",
                });
            }

            // Update the junior's stripe
            const { error: updateError } = await supabase
                .from("Junior")
                .update({
                    current_stripe: nextStripe.stripe_name,
                })
                .eq("junior_id", juniorId);

            if (updateError) {
                return fail(500, {
                    message: "Could not update stripe.",
                });
            }

            // Remove Admin Mode session (only the specific one used for this upgrade)
            const { error: sessionError } = await supabase
                .from("admin_mode_sessions")
                .delete()
                .eq("id", adminSession.id);

            if (sessionError) {
                return fail(500, {
                    message: "Could not exit Admin Mode.",
                });
            }

            // Remove Admin Mode cookie
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