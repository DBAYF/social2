import { CloseCircleOutlined, CloseOutlined, FileImageOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Modal from 'react-modal';
import { useFeedStore, useAuthStore } from '~/stores';
import { useToast } from '~/hooks/useToast';
import { useFileHandler } from '~/hooks';
import { IImage } from '~/types/types';
import { POST_TYPES, POST_TYPE_LABELS } from '~/utils/constants';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
}

Modal.setAppElement('#root');

const CreatePostModal: React.FC<IProps> = ({ isOpen, onAfterOpen, closeModal }) => {
    const [content, setContent] = useState('');
    const [postType, setPostType] = useState<'intro' | 'update' | 'ask' | 'opportunity'>('update');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [privacy, setPrivacy] = useState<'public' | 'members' | 'connections'>('public');

    const { user } = useAuthStore();
    const { createPost, isLoading } = useFeedStore();
    const { success, error: showError } = useToast();
    const { imageFile, onFileChange, clearFiles, removeImage } = useFileHandler<IImage[]>('multiple', []);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPrivacy(e.target.value as 'public' | 'members' | 'connections');
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !tags.includes(tag) && tags.length < 5) {
            setTags([...tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const onSubmit = async () => {
        if (!content.trim()) return;

        try {
            await createPost({
                type: postType,
                content: content.trim(),
                tags,
                visibility: privacy,
                images: imageFile.map(img => img.url)
            });

            success('Post created successfully!');
            setContent('');
            setTags([]);
            setTagInput('');
            setPostType('update');
            setPrivacy('public');
            clearFiles();
            closeModal();
        } catch (err) {
            showError('Failed to create post');
        }
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={props.closeModal}
            contentLabel="Create Post"
            className="modal"
            // shouldCloseOnOverlayClick={!isDeleting}
            overlayClassName="modal-overlay"
        >
            <div className="relative">
                <div
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-indigo-1100"
                    onClick={props.closeModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500 dark:text-white" />
                </div>
                <div className="w-full laptop:w-40rem p-4 laptop:px-8">
                    <h2 className="dark:text-white">Create Post</h2>

                    {/* Post Type Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Post Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {POST_TYPES.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setPostType(type)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        postType === type
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {POST_TYPE_LABELS[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Selector */}
                    <div className="mb-4">
                        <select
                            className="!py-1 !text-sm w-32 dark:bg-indigo-1100 dark:text-white dark:border-gray-800"
                            id="privacy"
                            name="privacy"
                            onChange={handlePrivacyChange}
                            value={privacy}
                        >
                            <option value="public">Public</option>
                            <option value="members">Members</option>
                            <option value="connections">Connections</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags (optional)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add a tag..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                disabled={!tagInput.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="flex flex-col">
                        <textarea
                            className="dark:bg-indigo-1100 dark:text-white dark:!border-gray-800"
                            cols={3}
                            id="post"
                            name="post"
                            onChange={handleContentChange}
                            placeholder="What's on your mind?"
                            rows={3}
                            readOnly={isLoading}
                            value={content}
                        />
                        <div className="flex items-center">
                            {/* --- UPLOAD OPTIONS */}
                            <div className="flex items-center flex-grow">
                                <input
                                    multiple
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={onFileChange}
                                    readOnly={isLoading}
                                    id="photos"
                                />
                                <label
                                    className="inline-flex items-center cursor-pointer justify-start border-gray-200 text-gray-400 py-2 text-xs"
                                    htmlFor="photos"
                                >
                                    <div
                                        className="group flex items-center justify-center w-10 h-10 border-2 border-dashed border-gray-400 hover:border-indigo-700"
                                        title="Upload photo"
                                    >
                                        <FileImageOutlined className="text-xl text-gray-400 hover:text-indigo-700" />
                                    </div>
                                </label>
                            </div>
                            {/* ---- POST BUTTON --- */}
                            <div className="flex justify-end">
                                <button
                                    onClick={onSubmit}
                                    disabled={isLoading || !content.trim()}
                                    className={`px-4 py-2 rounded-md font-medium ${
                                        isLoading || !content.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {isLoading ? 'Creating...' : 'Create Post'}
                                </button>
                            </div>
                        </div>
                        {/*  ---- IMAGES PREVIEWS LIST ----- */}
                        <div className="flex items-center space-x-2">
                            {imageFile && imageFile.map((image) => (
                                <div
                                    className="w-14 h-14 !bg-cover !bg-no-repeat relative"
                                    key={image.id}
                                    style={{
                                        background: `#f7f7f7 url(${image.url})`
                                    }}
                                >
                                    <CloseCircleOutlined
                                        className="p-2 absolute top-0 left-0 right-0 bottom-0 margin-auto text-3xl text-white hover:bg-red-600 cursor-pointer outline-none opacity-75 hover:opacity-100"
                                        onClick={() => removeImage(image.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePostModal;
