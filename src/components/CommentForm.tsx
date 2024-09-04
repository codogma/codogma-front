"use client";
import React, {useEffect, useState} from 'react';
import {CreateComment, GetComment, UpdateComment} from "@/types";
import {createComment, updateComment} from "@/helpers/commentAPI";
import {Box, Button, TextField} from "@mui/material";
import {useAuth} from "@/components/AuthProvider";

interface CommentFormProps {
    articleId: number;
    parentCommentId?: number;
    comment?: GetComment | null;
    onCommentAdded: () => void;
    onCancelEdit?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
                                                     articleId,
                                                     parentCommentId,
                                                     comment,
                                                     onCommentAdded,
                                                     onCancelEdit
                                                 }) => {
    const [content, setContent] = useState<string>('');
    const {state} = useAuth();

    useEffect(() => {
        if (comment) {
            setContent(comment.content);
        }
    }, [comment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (comment) {
            const updatedComment: UpdateComment = {content};
            await updateComment(comment.id, updatedComment);
        } else {
            const newComment: CreateComment = {content, articleId, parentCommentId};
            await createComment(newComment);
        }

        setContent('');
        onCommentAdded();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <TextField
                multiline
                minRows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment..."
                variant="outlined"
                fullWidth
                disabled={!state.isAuthenticated}
            />
            <Box sx={{display: 'flex', gap: 1}}>
                <Button type="submit" variant="outlined" size="small">
                    {comment ? 'Update Comment' : 'Add Comment'}
                </Button>
                {onCancelEdit && (
                    <Button variant="outlined" color="warning" size="small" onClick={onCancelEdit}>
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default CommentForm;