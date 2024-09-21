"use client";
import React, {useEffect, useState} from 'react';
import {CreateComment, GetComment, UpdateComment} from "@/types";
import {createComment, updateComment} from "@/helpers/commentAPI";
import {Box, Button, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
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
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
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
    }

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
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
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{p: 1}}>Log in</Typography>
            </Popover>
        </Box>
    );
};

export default CommentForm;