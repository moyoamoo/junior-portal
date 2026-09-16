import { fail, redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ locals, params, cookies }) => {
        try {
            const supabase = locals.supabase;
            const juniorId = params.juniorId;

            // Get the current junior
            const { data: junior, error: juniorError } = await supabase
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

            // Get the logged-in user
            const user = await locals.getUser();

            if (!user) {
                return fail(401, {
                    message: "You must be logged in.",
                });
            }

            // Remove Admin Mode session
            const { error: sessionError } = await supabase
                .from("admin_mode_sessions")
                .delete()
                .eq("user_id", user.id);

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