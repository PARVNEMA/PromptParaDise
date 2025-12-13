import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Share,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {
  ArrowLeft,
  Copy,
  Heart,
  Bookmark,
  Eye,
  Calendar,
  Share2,
  CheckCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PromptService } from '@/services/prompt.service';
import { DetailPromptDetails } from '@/types/prompts.types';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useOtherContext } from '@/context/OtherContext';

const { width, height } = Dimensions.get('window');

const PromptDetail = () => {
  const [data, setData] = useState<DetailPromptDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { id } = useLocalSearchParams();
  const { userBookmarks, userLikes, optimisticToggleLike, optimisticToggleBookmark } = useOtherContext();

  // Check if current prompt is liked/bookmarked
  const isLiked = useMemo(
    () => {
      if (!data) return false;
      return userLikes.some((like) => like.id === data.id || like._id === data._id);
    },
    [userLikes, data]
  );

  const isBookmarked = useMemo(
    () => {
      if (!data) return false;
      return userBookmarks.some((bookmark) => bookmark.id === data.id || bookmark._id === data._id);
    },
    [userBookmarks, data]
  );

  const fetchPromptDetails = async () => {
    try {
      setIsLoading(true);
      const response = await PromptService.getPromptById(id as string);
      if (response.success) {
        setData(response.data);
      } else {
        Alert.alert('Error', 'Failed to load prompt details');
      }
    } catch (error) {
      console.log('error in fetchPromptDetails', error);
      Alert.alert('Error', 'Failed to load prompt details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptDetails();
  }, []);

  const copyToClipboard = async () => {
    if (data?.prompt) {
      await Clipboard.setStringAsync(data.prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
      ToastAndroid.show('Prompt copied to clipboard', ToastAndroid.SHORT);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this prompt: ${data?.title}\n\n${data?.prompt}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLike = async () => {
    if (!data) return;

    // OPTIMISTIC UPDATE - Update UI immediately
    optimisticToggleLike(data);

    try {
      const res = await PromptService.toggleLike(data.id || data._id);
      console.log('🔵 Toggle like response:', res);

      if (res) {
        // Update the local data state with the server response
        setData(prev => prev ? {
          ...prev,
          likeCount: res.likeCount,
        } : null);
      } else {
        console.error('❌ Server returned error');
        Alert.alert('Error', 'Failed to toggle like');
      }
    } catch (error) {
      console.log("❌ error in toggling the like", error);
      Alert.alert('Error', 'Failed to toggle like');
    }
  };

  const handleBookmark = async () => {
    if (!data) return;

    // OPTIMISTIC UPDATE - Update UI immediately
    optimisticToggleBookmark(data);

    try {
      const res = await PromptService.toggleBookmark(data.id || data._id);
      console.log('🟣 Toggle bookmark response:', res);

      if (res) {
        // Update the local data state with the server response
        setData(prev => prev ? {
          ...prev,
          bookmarkCount: res.bookmarkCount,
        } : null);
      } else {
        console.error('❌ Server returned error');
        Alert.alert('Error', 'Failed to toggle bookmark');
      }
    } catch (error) {
      console.log("❌ error in toggling the bookmark", error);
      Alert.alert('Error', 'Failed to toggle bookmark');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Prompt not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Floating Header */}
      <View className="absolute top-12 left-0 right-0 z-10 px-2 ">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/95 backdrop-blur-lg rounded-full p-3 shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            className="bg-white/95 backdrop-blur-lg rounded-full p-3 shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Share2 size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        {data.imageUrl && (
          <View className="relative bg-gray-50">
            <Image
              source={{ uri: data.imageUrl }}
              style={{
                width: width,
                height: height * 0.45,
                resizeMode: 'contain',
              }}
            />
          </View>
        )}

        {/* Content Section */}
        <View className="px-5 py-6" style={{ marginTop: data.imageUrl ? 0 : 80 }}>
          {/* Category & Featured Badges */}
          <View className="flex-row items-center mb-4">
            <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-full shadow-sm">
              <Text className="text-primary font-bold text-xs uppercase tracking-wider">
                {data.category.name}
              </Text>
            </View>
            {data.isFeatured && (
              <View className="bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 rounded-full ml-2 shadow-sm">
                <Text className="text-gray-900 font-bold text-xs uppercase tracking-wider">
                  ⭐ Featured
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {data.title}
          </Text>

          {/* Author Info */}
          <View className="flex-row items-center mb-5">
            <Image
              source={{ uri: data.creator.avatar }}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {data.creator.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatDate(data.createdAt)}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row items-center mb-6 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center flex-1">
              <View className="bg-red-100 rounded-full p-2">
                <Heart size={16} color="#EF4444" fill="#EF4444" />
              </View>
              <Text className="text-sm font-semibold text-gray-700 ml-2">
                {data.likeCount || 0}
              </Text>
            </View>

            <View className="flex-row items-center flex-1">
              <View className="bg-blue-100 rounded-full p-2">
                <Bookmark size={16} color="#3B82F6" fill="#3B82F6" />
              </View>
              <Text className="text-sm font-semibold text-gray-700 ml-2">
                {data.bookmarkCount || 0}
              </Text>
            </View>

            <View className="flex-row items-center flex-1">
              <View className="bg-gray-200 rounded-full p-2">
                <Calendar size={16} color="#6B7280" />
              </View>
              <Text className="text-xs font-medium text-gray-600 ml-2">
                {formatDate(data.createdAt).split(' ').slice(0, 2).join(' ')}
              </Text>
            </View>
          </View>

          {/* Description Card */}
          <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 mb-5 border border-gray-200">
            <Text className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
              Description
            </Text>
            <Text className="text-base text-gray-800 leading-7">
              {data.description}
            </Text>
          </View>

          {/* Prompt Card with Copy Button */}
          <View className="bg-white rounded-3xl p-6 mb-5 border-2 border-gray-200 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Prompt
              </Text>
              <TouchableOpacity
                onPress={copyToClipboard}
                className={`flex-row items-center px-5 py-2.5 rounded-full ${
                  isCopied ? 'bg-green-500' : 'bg-blue-600'
                }`}
                style={{
                  shadowColor: isCopied ? '#10B981' : '#3B82F6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                {isCopied ? (
                  <>
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text className="text-white font-bold ml-2 text-xs">
                      Copied!
                    </Text>
                  </>
                ) : (
                  <>
                    <Copy size={16} color="#FFFFFF" />
                    <Text className="text-white font-bold ml-2 text-xs">
                      Copy
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Prompt Content */}
            <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-l-4 border-blue-500">
              <Text
                className="text-base text-gray-900 leading-7 font-mono"
                selectable
              >
                {data.prompt}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row mb-6 gap-3">
            <TouchableOpacity
              className={`flex-1 rounded-2xl py-5 items-center ${
                isLiked ? 'bg-red-500' : 'bg-white border-2 border-red-200'
              }`}
              onPress={handleLike}
              style={{
                shadowColor: isLiked ? '#EF4444' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isLiked ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Heart
                size={28}
                color={isLiked ? '#FFFFFF' : '#EF4444'}
                fill={isLiked ? '#FFFFFF' : 'none'}
              />
              <Text className={`font-bold mt-2 ${isLiked ? 'text-white' : 'text-red-600'}`}>
                {isLiked ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-2xl py-5 items-center ${
                isBookmarked ? 'bg-blue-500' : 'bg-white border-2 border-blue-200'
              }`}
              onPress={handleBookmark}
              style={{
                shadowColor: isBookmarked ? '#3B82F6' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isBookmarked ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Bookmark
                size={28}
                color={isBookmarked ? '#FFFFFF' : '#3B82F6'}
                fill={isBookmarked ? '#FFFFFF' : 'none'}
              />
              <Text className={`font-bold mt-2 ${isBookmarked ? 'text-white' : 'text-blue-600'}`}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Metadata Card */}
          <View className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-200">
            <Text className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">
              Details
            </Text>
            <View>
              <View className="flex-row justify-between py-3 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Status</Text>
                <View className={`px-3 py-1 rounded-full ${data.isPublic ? 'bg-green-100' : 'bg-gray-200'}`}>
                  <Text className={`text-xs font-bold ${data.isPublic ? 'text-green-700' : 'text-gray-700'}`}>
                    {data.isPublic ? 'Public' : 'Private'}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between py-3 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Created</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatDate(data.createdAt)}
                </Text>
              </View>
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-gray-600">Last Updated</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatDate(data.updatedAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PromptDetail;