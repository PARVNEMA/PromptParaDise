import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useOtherContext } from '@/context/OtherContext';
import PromptCard from '@/components/cards/PromptCard';
import { PromptService } from '@/services/prompt.service';
import { Prompt } from '@/types/prompts.types';

const Bookmark = () => {
  const {
    userBookmarks,
    userLikes,
    optimisticToggleLike,
    refetchUserData,
    optimisticToggleBookmark
  } = useOtherContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchUserData();
    setRefreshing(false);
  }, [refetchUserData]);

  const handleLike = async (promptId: string) => {
    console.log('🔵 handleLike called with promptId:', promptId);

    // Find the prompt in bookmarks or likes to pass to optimistic update
    // We search in userBookmarks first since we are on the bookmark screen
    const prompt = userBookmarks.find(p => p.id === promptId || p._id === promptId) ||
                   userLikes.find(p => p.id === promptId || p._id === promptId);

    if (!prompt) {
      console.error('❌ Prompt not found for optimistic update');
      return;
    }

    // OPTIMISTIC UPDATE - Update UI immediately
    optimisticToggleLike(prompt);

    try {
      const res = await PromptService.toggleLike(promptId);
      console.log('🔵 Toggle like response:', res);

      if (res) {
        // Success - state is already updated optimistically
        // We might want to sync silently to be sure
        // await refetchUserData();
      } else {
        // If server request failed, revert the optimistic update
        console.error('❌ Server returned error, reverting optimistic update');
        await refetchUserData();
        Alert.alert('Error', 'Failed to toggle like');
      }
    } catch (error) {
      console.log("❌ error in toggling the like", error);
      // Revert optimistic update on error
      await refetchUserData();
      Alert.alert('Error', 'Failed to toggle like');
    }
  };

  const handleBookmark = async (promptId: string) => {
    console.log('🟣 handleBookmark called with promptId:', promptId);

    const prompt = userBookmarks.find(p => p.id === promptId || p._id === promptId);

    if (!prompt) {
       console.error('❌ Prompt not found for optimistic update');
       return;
    }

    // OPTIMISTIC UPDATE - Update UI immediately
    // This will remove the item from the list immediately because userBookmarks is filtered
    optimisticToggleBookmark(prompt);

    try {
      const res = await PromptService.toggleBookmark(promptId);
      console.log('🟣 Toggle bookmark response:', res);

      if (res) {
        Alert.alert(
          'Success',
          res.isBookmarked ? 'Prompt bookmarked!' : 'Bookmark removed!',
          [{ text: 'OK' }]
        );
      } else {
        // If server request failed, revert the optimistic update
        console.error('❌ Server returned error, reverting optimistic update');
        await refetchUserData();
        Alert.alert('Error', 'Failed to toggle bookmark', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.log("❌ error in toggling the bookmark", error);
      // Revert optimistic update on error
      await refetchUserData();
      Alert.alert('Error', 'Failed to toggle bookmark', [{ text: 'OK' }]);
    }
  };

  const renderItem = ({ item }: { item: Prompt }) => (
    <PromptCard
      item={item}
      onBookmark={handleBookmark}
      onLike={handleLike}
    />
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Your Bookmarks 🔖
        </Text>
        <Text className="text-base text-gray-600 mt-1">
          {userBookmarks.length} saved prompt{userBookmarks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={userBookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item._id}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-lg font-semibold text-gray-600 mb-2">
              No bookmarks yet
            </Text>
            <Text className="text-base text-gray-500 text-center px-6">
              Save prompts you like to access them easily here.
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Bookmark;