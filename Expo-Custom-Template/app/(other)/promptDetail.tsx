import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Share,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const PromptDetail = () => {
  const [data, setData] = useState<DetailPromptDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { id } = useLocalSearchParams();

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
      setTimeout(() => setIsCopied(false), 2000);
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
    <View className="flex-1 bg-gray-50">
      {/* Header with Back Button */}
      <View className="absolute top-0 left-0 right-0 z-10">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent']}
          style={{ paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 backdrop-blur-lg rounded-full p-2"

            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="bg-white/20 backdrop-blur-lg rounded-full p-2"

            >
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        {data.imageUrl && (
          <View className="relative">
            <Image
              source={{ uri: data.imageUrl }}
              style={{
                width: width,
                height: height * 0.4,
                resizeMode: 'contain',
              }}
            />
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(249,250,251,1)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
          </View>
        )}

        {/* Content Section */}
        <View className="px-4" style={{ marginTop: data.imageUrl ? -40 : 60 }}>
          {/* Category Badge */}
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-600 px-4 py-2 rounded-full">
              <Text className="text-white font-bold text-sm">
                {data.category}
              </Text>
            </View>
            {data.isFeatured && (
              <View className="bg-yellow-500 px-4 py-2 rounded-full ml-2">
                <Text className="text-white font-bold text-sm">
                  ⭐ Featured
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            {data.title}
          </Text>

          {/* Stats Row */}
          <View className="flex-row items-center mb-6 flex-wrap">
            <View className="flex-row items-center mr-4 mb-2">
              <Heart size={18} color="#EF4444" />
              <Text className="text-sm text-gray-600 ml-1 font-medium">
                {data.likeCount || 0} likes
              </Text>
            </View>

            <View className="flex-row items-center mr-4 mb-2">
              <Bookmark size={18} color="#3B82F6" />
              <Text className="text-sm text-gray-600 ml-1 font-medium">
                {data.bookmarkCount || 0} saves
              </Text>
            </View>

            <View className="flex-row items-center mr-4 mb-2">
              <Eye size={18} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1 font-medium">
                {data.views || 0} views
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Calendar size={18} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1 font-medium">
                {formatDate(data.createdAt)}
              </Text>
            </View>
          </View>

          {/* Description Card */}
          <Card variant="elevated" padding="lg" className="mb-4">
            <Text className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Description
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              {data.description}
            </Text>
          </Card>

          {/* Prompt Card with Copy Button */}
          <Card variant="elevated" padding="lg" className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Prompt
              </Text>
              <TouchableOpacity
                onPress={copyToClipboard}
                className={`flex-row items-center px-4 py-2 rounded-lg ${
                  isCopied ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,
                  elevation: 3,
                }}
              >
                {isCopied ? (
                  <>
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-2 text-sm">
                      Copied!
                    </Text>
                  </>
                ) : (
                  <>
                    <Copy size={16} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-2 text-sm">
                      Copy
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Prompt Content with Background */}
            <View className="bg-gray-100 rounded-lg p-4 border-l-4 border-blue-600">
              <Text
                className="text-base text-gray-800 leading-6 font-mono"
                selectable
              >
                {data.prompt}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View className="flex-row mb-6">
            <TouchableOpacity
              className="flex-1 bg-red-50 border border-red-200 rounded-lg py-4 mr-2 items-center"
              onPress={() => Alert.alert('Like', 'Like functionality coming soon!')}
            >
              <Heart size={24} color="#EF4444" />
              <Text className="text-red-600 font-semibold mt-2">Like</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-blue-50 border border-blue-200 rounded-lg py-4 ml-2 items-center"
              onPress={() =>
                Alert.alert('Bookmark', 'Bookmark functionality coming soon!')
              }
            >
              <Bookmark size={24} color="#3B82F6" />
              <Text className="text-blue-600 font-semibold mt-2">Save</Text>
            </TouchableOpacity>
          </View>

          {/* Metadata Card */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <Text className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Details
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Status</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {data.isPublic ? 'Public' : 'Private'}
                </Text>
              </View>
              <View className="flex-row justify-between py-2 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Created</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatDate(data.createdAt)}
                </Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-gray-600">Last Updated</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatDate(data.updatedAt)}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default PromptDetail;