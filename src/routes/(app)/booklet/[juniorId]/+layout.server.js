import { getTheme } from "$lib/themes";

export async function load({ params, locals }) {
    const { data: user, error } = await locals.supabase
        .from("Junior")
        .select(
            "juniorId:junior_id, firstName:first_name, lastName:last_name, currentStripe:current_stripe",
        )
        .eq("junior_id", params.juniorId)
        .single();

    if (error) {
        console.error(error);
        return { user: null, theme: {} };
    }

    const theme = getTheme(user.currentStripe);

    return { user, theme };
}