import { supabase } from "$lib/supabaseClient";


// add comment to database 
export const addCommentSupabase = async (juniorId, activityId, comment) => {

    return await supabase
        .from("TaskComments")
        .insert({
            junior_id: juniorId,
            activity_id: activityId,
            comment: comment,
        })
        .select()
        .single();

}

//delete comment from supabase
export const deleteCommentSupabase = async (juniorId, activityId) => {

    return await supabase
        .from("TaskComments")
        .delete()
        .eq("activity_id", activityId)
        .eq("junior_id", juniorId)
        .select();

}

//edit comments from supabase
export const editCommentSupabase = async (juniorId, activityId, comment) => {
    
    return await supabase
        .from("TaskComments")
        .update({
            comment: comment,
        })
        .eq("activity_id", activityId)
        .eq("junior_id", juniorId)
        .select()
        .single();
}

