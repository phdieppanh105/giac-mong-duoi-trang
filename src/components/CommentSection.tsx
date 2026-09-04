import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Comment } from '../types';
import { formatRelativeTime, playDreamyChime } from '../lib/utils';
import {
  MessageCircle,
  Send,
  CornerDownRight,
  Heart,
  User,
  LogIn,
  Sparkles,
  Smile,
  Moon,
  Cloud,
} from 'lucide-react';

interface CommentSectionProps {
  characterId: string;
  characterName: string;
  soundEnabled: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  characterId,
  characterName,
  soundEnabled,
}) => {
  const { user, profile, login } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Subscribe to real-time comments for this character
  useEffect(() => {
    setLoading(true);

    const commentsRef = collection(db, 'comments');

    const q = query(
      commentsRef,
      where('characterId', '==', characterId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Comment[] = [];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...doc.data(),
          } as Comment);
        });

        // Sort newest first client-side
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setComments(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'comments');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [characterId]);

  // Separate root comments and nested replies
  const rootComments = comments.filter((c) => !c.parentId);

  const repliesMap = comments.reduce<Record<string, Comment[]>>(
    (acc, curr) => {
      if (curr.parentId) {
        if (!acc[curr.parentId]) {
          acc[curr.parentId] = [];
        }

        acc[curr.parentId].push(curr);
      }

      return acc;
    },
    {}
  );

  // Determine current display name:
  // nickname -> Google displayName -> 'Bảo Bối'
  const currentDisplayName =
    profile?.nickname || user?.displayName || 'Bảo Bối';

  const currentPhotoURL =
    profile?.photoURL || user?.photoURL || '';

  const handleSendRootComment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user || !newCommentText.trim() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      if (soundEnabled) {
        playDreamyChime('sparkle');
      }

      const nowIso = new Date().toISOString();

      await addDoc(collection(db, 'comments'), {
        characterId,
        userId: user.uid,
        userName: currentDisplayName,
        userAvatar: currentPhotoURL,
        content: newCommentText.trim(),
        createdAt: nowIso,
      });

      setNewCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);

      handleFirestoreError(
        error,
        OperationType.CREATE,
        'comments'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (
    e: React.FormEvent,
    parentComment: Comment
  ) => {
    e.preventDefault();

    if (!user || !replyText.trim() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      if (soundEnabled) {
        playDreamyChime('sparkle');
      }

      const nowIso = new Date().toISOString();

      await addDoc(collection(db, 'comments'), {
        characterId,
        parentId: parentComment.id,
        userId: user.uid,
        userName: currentDisplayName,
        userAvatar: currentPhotoURL,
        content: replyText.trim(),
        createdAt: nowIso,
      });

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);

      handleFirestoreError(
        error,
        OperationType.CREATE,
        'comments'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-7 border-t border-[#D9F0FF] space-y-5">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="relative overflow-hidden rounded-[22px] bg-[#D9F0FF]/45 border border-[#89B9E6]/20 px-4 py-3.5">
        {/* Decorative cloud */}
        <Cloud className="absolute -right-3 -top-5 w-16 h-16 text-[#89B9E6]/15 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#31465A] min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FFFDF7] border border-[#89B9E6]/30 text-[#31465A] flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider truncate">
                Bình Luận ({comments.length})
              </h3>

              <div className="text-[9px] sm:text-[10px] text-[#6d879e] mt-0.5">
                Góc trò chuyện dưới ánh trăng
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#6d879e] shrink-0">
            <Sparkles className="w-3 h-3 text-[#89B9E6]" />
            <span>dreamy chat</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          INPUT BOX / AUTH PROMPT
      ========================================================== */}
      {user ? (
        <form
          onSubmit={handleSendRootComment}
          className="rounded-[22px] bg-[#FFFDF7] border border-[#D9F0FF] p-3.5 sm:p-4 shadow-sm"
        >
          <div className="flex gap-2.5 items-start">
            {/* Current user avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#89B9E6]/35 shrink-0 bg-[#D9F0FF] flex items-center justify-center shadow-sm">
              {currentPhotoURL ? (
                <img
                  src={currentPhotoURL}
                  alt={currentDisplayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-[#31465A]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="relative">
                <textarea
                  value={newCommentText}
                  onChange={(e) =>
                    setNewCommentText(e.target.value)
                  }
                  placeholder={`Chia sẻ cảm nghĩ về ${characterName}...`}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#D9F0FF]/25 border border-[#89B9E6]/25 rounded-2xl text-xs sm:text-sm text-[#31465A] placeholder-[#91a5b6] focus:outline-hidden focus:border-[#89B9E6]/60 focus:ring-2 focus:ring-[#89B9E6]/15 transition-all resize-none shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <span className="text-[10px] sm:text-[11px] text-[#7f94a6] pl-1 truncate">
                  Đang bình luận với tên:{' '}
                  <strong className="text-[#31465A]">
                    {currentDisplayName}
                  </strong>
                </span>

                <button
                  type="submit"
                  disabled={
                    !newCommentText.trim() || submitting
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#31465A] hover:bg-[#26394b] text-[#FFFDF7] text-xs font-bold disabled:opacity-40 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Send className="w-3 h-3" />

                  <span>
                    {submitting ? 'Đang gửi...' : 'Gửi'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="relative overflow-hidden p-4 rounded-[22px] bg-[#FFFDF7] border border-[#C7DFA3]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-sm">
          <Cloud className="absolute -right-4 -top-5 w-20 h-20 text-[#D9F0FF] pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C7DFA3]/45 text-[#31465A] border border-[#C7DFA3] flex items-center justify-center shrink-0">
              <Smile className="w-4 h-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#31465A]">
                Đăng nhập để gửi bình luận và biệt danh dưới ánh trăng
              </p>

              <span className="text-[10px] sm:text-[11px] text-[#7f94a6]">
                Cùng các bảo bối khác giao lưu nhé!
              </span>
            </div>
          </div>

          <button
            onClick={() => login()}
            className="relative z-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#31465A] text-[#FFFDF7] hover:bg-[#26394b] text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập Google</span>
          </button>
        </div>
      )}

      {/* =========================================================
          COMMENT LIST
      ========================================================== */}
      {loading ? (
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9F0FF]/45 border border-[#89B9E6]/20 text-xs text-[#6d879e]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#89B9E6]" />
            Đang tải bình luận...
          </div>
        </div>
      ) : rootComments.length === 0 ? (
        <div className="relative overflow-hidden py-9 px-5 text-center bg-[#D9F0FF]/25 rounded-[22px] border border-dashed border-[#89B9E6]/35">
          <Moon className="absolute -right-3 -top-3 w-16 h-16 text-[#89B9E6]/10 pointer-events-none" />

          <Heart className="relative w-6 h-6 text-[#89B9E6] mx-auto mb-2 opacity-70" />

          <p className="relative text-xs text-[#6d879e] leading-relaxed">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại
            lời nhắn yêu thương nhé!
          </p>

          <div className="relative mt-3 text-[10px] text-[#89B9E6]">
            ⊹•┈┈౨ৎ┈┈•⊹
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment) => {
            const replies = repliesMap[comment.id] || [];
            const isReplying =
              replyingTo?.id === comment.id;

            return (
              <div
                key={comment.id}
                className="relative p-3.5 sm:p-4 rounded-[22px] bg-[#FFFDF7] border border-[#D9F0FF] shadow-sm space-y-3 overflow-hidden"
              >
                {/* Tiny decorative mark */}
                <div className="absolute right-3 top-3 text-[#89B9E6]/25 text-sm pointer-events-none">
                  ☁︎
                </div>

                {/* =================================================
                    MAIN COMMENT
                ================================================== */}
                <div className="flex gap-3 items-start">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#D9F0FF] border border-[#89B9E6]/30 shrink-0 flex items-center justify-center shadow-sm">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[#31465A]">
                        {comment.userName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* User + time */}
                    <div className="flex items-center justify-between gap-2 pr-5">
                      <h4 className="text-xs font-bold text-[#31465A] truncate">
                        {comment.userName}
                      </h4>

                      <span className="text-[10px] text-[#91a5b6] shrink-0">
                        {formatRelativeTime(
                          comment.createdAt
                        )}
                      </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-xs sm:text-sm text-[#536b80] mt-1 leading-relaxed whitespace-pre-wrap font-sans">
                      {comment.content}
                    </p>

                    {/* Reply action */}
                    <div className="mt-2.5 flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (!user) {
                            login();
                          } else {
                            setReplyingTo(
                              isReplying ? null : comment
                            );
                            setReplyText('');
                          }
                        }}
                        className="text-[11px] font-semibold text-[#5f7890] hover:text-[#31465A] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Trả lời</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    REPLY FORM
                ================================================== */}
                {isReplying && user && (
                  <form
                    onSubmit={(e) =>
                      handleSendReply(e, comment)
                    }
                    className="ml-8 sm:ml-11 pt-3 border-t border-[#D9F0FF] flex gap-2 items-start"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#C7DFA3]/45 border border-[#C7DFA3] flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-[#31465A]" />
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(e) =>
                        setReplyText(e.target.value)
                      }
                      placeholder={`Trả lời @${comment.userName}...`}
                      rows={1}
                      autoFocus
                      className="flex-1 min-w-0 px-3 py-2 bg-[#D9F0FF]/20 border border-[#89B9E6]/25 rounded-xl text-xs text-[#31465A] placeholder-[#91a5b6] focus:outline-hidden focus:border-[#89B9E6]/55 focus:ring-1 focus:ring-[#89B9E6]/20 resize-none"
                    />

                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setReplyingTo(null)
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-[#D9F0FF]/55 text-[#5f7890] text-xs font-semibold hover:bg-[#D9F0FF] cursor-pointer transition-colors"
                      >
                        Hủy
                      </button>

                      <button
                        type="submit"
                        disabled={
                          !replyText.trim() || submitting
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#31465A] text-[#FFFDF7] text-xs font-bold hover:bg-[#26394b] disabled:opacity-40 cursor-pointer transition-colors"
                      >
                        Gửi
                      </button>
                    </div>
                  </form>
                )}

                {/* =================================================
                    NESTED REPLIES
                ================================================== */}
                {replies.length > 0 && (
                  <div className="ml-6 sm:ml-10 space-y-2 pt-3 border-t border-[#D9F0FF]">
                    {replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="flex gap-2.5 items-start p-2.5 rounded-xl bg-[#D9F0FF]/25 border border-[#89B9E6]/15"
                      >
                        {/* Reply avatar */}
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#C7DFA3]/45 border border-[#C7DFA3]/70 shrink-0 flex items-center justify-center">
                          {rep.userAvatar ? (
                            <img
                              src={rep.userAvatar}
                              alt={rep.userName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-[#31465A]">
                              {rep.userName.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#31465A] truncate">
                              {rep.userName}
                            </span>

                            <span className="text-[9px] text-[#91a5b6] shrink-0">
                              {formatRelativeTime(
                                rep.createdAt
                              )}
                            </span>
                          </div>

                          <p className="text-xs text-[#536b80] mt-0.5 whitespace-pre-wrap leading-relaxed">
                            {rep.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
