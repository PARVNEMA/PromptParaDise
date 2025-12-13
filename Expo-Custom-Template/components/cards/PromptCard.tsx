import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Heart, Bookmark, Eye, Calendar } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import { Prompt } from '@/types/prompts.types';
import { useOtherContext } from '@/context/OtherContext';

interface PromptCardProps {
  item: Prompt;
  onLike?: (promptId: string) => void;
  onBookmark?: (promptId: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ item, onLike, onBookmark }) => {
  const { userBookmarks, userLikes } = useOtherContext();

  // Use useMemo to reactively compute these values when context changes
  const isBookmarked = useMemo(
    () => {
      const result = userBookmarks.some((bookmark) => bookmark.id === item.id || bookmark._id === item._id);
      // console.log(`🟢 [${item.title?.substring(0, 20)}] isBookmarked:`, result, 'userBookmarks:', userBookmarks.length);
      return result;
    },
    [userBookmarks, item.id, item._id]
  );

  const isLiked = useMemo(
    () => {
      const result = userLikes.some((like) => like.id === item.id || like._id === item._id);
      // console.log(`🟢 [${item.title?.substring(0, 20)}] isLiked:`, result, 'userLikes:', userLikes.length);
      return result;
    },
    [userLikes, item.id, item._id]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/(other)/promptDetail',
          params: { id: item.id },
        })
      }
      className="mb-6 mx-4"
    >
      <View className="bg-white dark:bg-card-dark rounded-[2rem] shadow-lg overflow-hidden border border-gray-100 dark:border-white/5">
        {/* Image Section - Only show if imageUrl exists */}
        {item.imageUrl && (
          <View className="relative h-48">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-full h-full "
              resizeMode="contain"
            />
            {/* Category Badge Overlay */}
            <View className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
              <Text className="text-xs font-bold uppercase text-gray-900 dark:text-white">
                {item.category.name}
              </Text>
            </View>
            {item.isFeatured && (
              <View className="absolute top-4 left-4 bg-yellow-400/90 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/20">
                <Text className="text-xs font-bold uppercase text-gray-900">
                  ⭐ Featured
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Content Section */}
        <View className="p-6">
          {/* Author Info */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <Image
                source={{ uri: item.creator.avatar }}
                className="w-10 h-10 rounded-full"

              />
              <Text className="text-sm font-medium text-gray-700 ">
                {item.creator.name}
              </Text>
            </View>
            <Text className="text-xs text-gray-400">
              {formatDate(item.createdAt)}
            </Text>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900  mb-2">
            {item.title}
          </Text>

          {/* Description */}
          <Text className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" numberOfLines={2}>
            {item.description}
          </Text>

          {/* Stats and Actions Row */}
          <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-row items-center gap-1.5"
                onPress={(e) => {
                  e.stopPropagation();
                  onLike?.(item.id);
                }}
              >
                <Heart
                  size={18}
                  color={isLiked ? '#EF4444' : '#9ca3af'}
                  fill={isLiked ? '#EF4444' : 'none'}
                />
                <Text className="text-xs text-gray-500">
                  {item.likeCount || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-1.5"
                onPress={(e) => {
                  e.stopPropagation();
                  onBookmark?.(item.id);
                }}
              >
                <Bookmark
                  size={18}
                  color={isBookmarked ? '#3B82F6' : '#9ca3af'}
                  fill={isBookmarked ? '#3B82F6' : 'none'}
                />
                <Text className="text-xs text-gray-500">
                  {item.bookmarkCount || 0}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs text-gray-400">View Details</Text>
              <Text className="text-xs text-gray-400">→</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PromptCard;
