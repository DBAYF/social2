import { CoffeeOutlined, UndoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useFeedStore, useAuthStore, useModalStore } from "~/stores";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CreatePostModal, PostItem, PostModals, SuggestedPeople } from "~/components/main";
import { Avatar, Loader, PostLoader } from "~/components/shared";
import { SUGGESTED_PEOPLE } from "~/constants/routes";
import { useDocumentTitle } from "~/hooks";
import { IPost } from "~/types/types";
import SideMenu from "./SideMenu";

const Home: React.FC = () => {
    const { posts, loading, hasMore, loadMore, error } = useFeedStore();
    const { user, isAuthenticated } = useAuthStore();
    const { openModal } = useModalStore();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    useDocumentTitle('Remake | Social Network for Founders');

    useEffect(() => {
        if (posts.length === 0) {
            loadMore();
        }
    }, [posts.length, loadMore]);

    const [infiniteScrollRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
        disabled: !!error,
    });

    const handleCreatePost = () => {
        setIsCreatePostOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <SideMenu />
                    </div>

                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Create Post Button */}
                        {isAuthenticated && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                                <div className="flex items-center space-x-3">
                                    <Avatar
                                        url={user?.profilePicture}
                                        name={user?.fullname || 'User'}
                                        size="md"
                                    />
                                    <button
                                        onClick={handleCreatePost}
                                        className="flex-1 text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        What's on your mind?
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Posts Feed */}
                        <div className="space-y-4">
                            {loading && posts.length === 0 ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <PostLoader key={i} />
                                    ))}
                                </div>
                            ) : (
                                <TransitionGroup>
                                    {posts.map((post: IPost) => (
                                        <CSSTransition
                                            key={post.id}
                                            timeout={500}
                                            classNames="fade"
                                        >
                                            <PostItem post={post} />
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            )}

                            {/* Infinite Scroll Trigger */}
                            <div ref={infiniteScrollRef}>
                                {loading && posts.length > 0 && (
                                    <div className="flex justify-center py-4">
                                        <Loader />
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="text-center py-4 text-red-500">
                                    Failed to load posts. Please try again.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block space-y-6">
                        <SuggestedPeople />
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreatePostOpen}
                onAfterOpen={() => {}}
                closeModal={() => setIsCreatePostOpen(false)}
            />

            {/* Other Modals */}
            <PostModals />
        </div>
    );
};

export default Home;