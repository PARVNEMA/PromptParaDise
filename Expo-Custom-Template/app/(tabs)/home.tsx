import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Search, Heart, Bookmark, Eye, Tag, Calendar, X, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Prompt } from '@/types/prompts.types';
import { PromptService } from '@/services/prompt.service';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const fetchPrompts = useCallback(async (search: string = '', pageIndex: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setIsLoading(true);
      }

      const response = await PromptService.getAllPrompts(search, pageIndex, pageSize);
      console.log('Prompts fetched:', response);

      if (response.success && response.data) {
        if (append) {
          setPrompts(prev => [...prev, ...response.data]);
        } else {
          setPrompts(response.data);
        }
        setHasMore(response.data?.length === pageSize);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch prompts');
        if (!append) {
          setPrompts([]);
        }
      }
    } catch (error) {
      setError('Error fetching prompts');
      console.error('Error fetching prompts:', error);
      if (!append) {
        setPrompts([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0);
      fetchPrompts(searchQuery, 0, false);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    await fetchPrompts(searchQuery, 0, false);
    setRefreshing(false);
  }, [fetchPrompts, searchQuery]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + pageSize;
      setPage(nextPage);
      fetchPrompts(searchQuery, nextPage, true);
    }
  }, [isLoading, hasMore, page, searchQuery, fetchPrompts]);

  const handleLike = (promptId: string) => {
    Alert.alert('Like', `Liked prompt: ${promptId}`, [{ text: 'OK' }]);
  };

  const handleBookmark = (promptId: string) => {
    Alert.alert('Bookmark', `Bookmarked prompt: ${promptId}`, [{ text: 'OK' }]);
  };

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

  const renderPromptCard = ({ item, index }: { item: Prompt; index: number }) => (
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
            <Text className="text-xs text-gray-600 ml-1">{item.likeCount || 0}</Text>

            <Bookmark size={14} color="#3B82F6" style={{ marginLeft: 12 }} />
            <Text className="text-xs text-gray-600 ml-1">{item.bookmarkCount || 0}</Text>

            <Eye size={14} color="#6B7280" style={{ marginLeft: 12 }} />
            <Text className="text-xs text-gray-600 ml-1">{item.views || 0}</Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500 ml-1">{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center flex-1 justify-center py-2"
          onPress={() => handleLike(item.id)}
        >
          <Heart size={18} color={item.likes?.length > 0 ? "#EF4444" : "#6B7280"} />
          <Text className="text-gray-600 ml-2 font-medium">Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center flex-1 justify-center py-2"
          onPress={() => handleBookmark(item.id)}
        >
          <Bookmark size={18} color={item.bookmarks?.length > 0 ? "#3B82F6" : "#6B7280"} />
          <Text className="text-gray-600 ml-2 font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );



  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </Text>
        <Text className="text-base text-gray-600 mt-1">
          Discover amazing prompts from the community
        </Text>
      </View>

      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search prompts, categories, tags..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Count */}
        {searchQuery.length > 0 && (
          <Text className="text-sm text-gray-600 mt-2">
            Found {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Prompts List */}
      <FlatList
        data={prompts}
        renderItem={renderPromptCard}
        keyExtractor={(item, index) => item.id || item._id || index.toString()}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}

        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-lg font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No prompts found' : 'No prompts available'}
            </Text>
            <Text className="text-base text-gray-500 text-center px-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Pull down to refresh and check for new prompts'}
            </Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/(other)/create-prompt')}
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
