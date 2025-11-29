import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Search, X, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PromptCard from '@/components/cards/PromptCard';
import { Prompt } from '@/types/prompts.types';
import { PromptService } from '@/services/prompt.service';

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

  const renderPromptCard = ({ item }: { item: Prompt }) => (
    <PromptCard item={item} onLike={handleLike} onBookmark={handleBookmark} />
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
