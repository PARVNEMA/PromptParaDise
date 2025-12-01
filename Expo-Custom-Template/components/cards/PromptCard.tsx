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
      console.log(`🟢 [${item.title?.substring(0, 20)}] isBookmarked:`, result, 'userBookmarks:', userBookmarks.length);
      return result;
    },
    [userBookmarks, item.id, item._id]
  );

  const isLiked = useMemo(
    () => {
      const result = userLikes.some((like) => like.id === item.id || like._id === item._id);
      console.log(`🟢 [${item.title?.substring(0, 20)}] isLiked:`, result, 'userLikes:', userLikes.length);
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
    >
      <Card variant="elevated" className="mb-4 mx-4">
        {/* Image Section - Only show if imageUrl exists */}
        {item.imageUrl && (
          <View className="mb-3 rounded-lg overflow-hidden">
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: '100%',
                height: 200,
                resizeMode: 'contain',
              }}
            />
          </View>
        )}

        {/* Content Section */}
        <View className="mb-3">
          {/* Category Badge */}
          <View className="flex-row items-center mb-2">
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-700 font-semibold text-xs">
                {item.category}
              </Text>
            </View>
            {item.isFeatured && (
              <View className="bg-yellow-100 px-3 py-1 rounded-full ml-2">
                <Text className="text-yellow-700 font-semibold text-xs">
                  ⭐ Featured
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-lg font-bold text-gray-900 mb-2">
            {item.title}
          </Text>

          {/* Description */}
          <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
            {item.description}
          </Text>

          {/* Stats Row */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Heart size={14} color="#EF4444" />
              <Text className="text-xs text-gray-600 ml-1">
                {item.likeCount || 0}
              </Text>

              <Bookmark size={14} color="#3B82F6" style={{ marginLeft: 12 }} />
              <Text className="text-xs text-gray-600 ml-1">
                {item.bookmarkCount || 0}
              </Text>

              <Eye size={14} color="#6B7280" style={{ marginLeft: 12 }} />
              <Text className="text-xs text-gray-600 ml-1">
                {item.views || 0}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Calendar size={12} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row border-t border-gray-200 pt-2">
          <TouchableOpacity
            className="flex-row items-center flex-1 justify-center py-2"
            onPress={(e) => {
              e.stopPropagation();
              onLike?.(item.id);
            }}
          >
            <Heart
              size={18}
              color={isLiked ? '#EF4444' : '#6B7280'}
              fill={isLiked ? '#EF4444' : 'none'}
            />
            <Text className="text-gray-600 ml-2 font-medium">Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center flex-1 justify-center py-2"
            onPress={(e) => {
              e.stopPropagation();
              onBookmark?.(item.id);
            }}
          >
            <Bookmark
              size={18}
              color={isBookmarked ? '#3B82F6' : '#6B7280'}
              fill={isBookmarked ? '#3B82F6' : 'none'}
            />
            <Text className="text-gray-600 ml-2 font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default PromptCard;
