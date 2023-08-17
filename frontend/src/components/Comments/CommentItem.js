import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import EditCommentForm from './EditCommentForm';
import CommentMenu from './CommentMenu';
import './Comments.css';
import { createLike, deleteLike } from '../../store/likes';

const CommentItem = ({comment, post, allUsers}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.currentUser);
    const firstName = allUsers[comment.authorId].firstName;
    const lastName = allUsers[comment.authorId].lastName;
    const allLikes = useSelector(state => state.entities.likes);
    const commentLikes = comment.likes.length;
    const [openForm, setOpenForm] = useState(false);
    const [liked, setLiked] = useState("");
    const [likeId, setLikeId] = useState(null);

    let commentLike;
    useEffect(() => {
        for (let i = 0; i < comment.likes.length; i++) {
            commentLike = comment.likes[i];
            if (allLikes[commentLike].likerId === currentUser.id) {
                setLikeId(commentLike);
                setLiked(true);
                break;
            } else {
                setLiked(false);
            }
        };
    }, []);

    const handleLike = (e) => {
        e.preventDefault();
        if (!liked) {
            dispatch(createLike({
                likeableType: "Comment",
                likeableId: comment.id
            })).then((resp) => { if (resp.ok) {
                setLiked(true);
            }})
        } else {
            dispatch(deleteLike(allLikes[likeId]))
            .then((resp) => { if (resp.ok) {
                setLiked(false);
            }})
        }
    }
    return (
        <>
        <div className="each-comment-container">
            <div className="comment-form-closed-container">
            <a href={'/users/' + comment.authorId}>
                    <img 
                        src={allUsers[comment.authorId]?.avatarSrc} 
                        className="each-comment-avatar"></img>
            </a>
                { openForm ? (
                <EditCommentForm 
                    post={post} 
                    comment={comment} 
                    formType={"Edit"}
                    openForm={openForm}
                    setOpenForm={setOpenForm}/>
            ) : (
                    <div className="comment-details">
                        <p className="commenter-name">{firstName} {lastName}</p>
                        <p className="comment-body">{comment.body}</p>
                    </div>
            )} 
                    { comment.likes.length > 0 && 
                    <div className="comment-likes-count">
                        <div className="comment-likes">
                            <i class="fa-solid fa-thumbs-up"/> &nbsp;
                            <p>{comment.likes.length}</p>
                        </div>
                    </div>
                    }
                <div className="comment-like-button">
                    { liked ? 
                        <button 
                            className="comment-liked"
                            onClick={handleLike}
                            >Like</button> :
                        <button 
                            className="comment-not-liked"
                            onClick={handleLike}
                            >Like</button>    
                    }
                </div>
            </div>
            { comment.authorId === currentUser.id ? (
                <CommentMenu 
                    comment={comment} 
                    openForm={openForm} 
                    setOpenForm={setOpenForm}
                    />
            ) : null }
        </div>     
        </>
    )
}

export default CommentItem;