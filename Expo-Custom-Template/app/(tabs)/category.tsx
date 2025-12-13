import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Image,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Grid, TrendingUp, Sparkles } from 'lucide-react-native';

import { CategoryService } from '@/services/category.service';
import { CategoryCardProp } from '@/types/category.types';
import { PromptService } from '@/services/prompt.service';
import { Prompt } from '@/types/prompts.types';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PromptCard from '@/components/cards/PromptCard';
import { MaterialIcons } from '@expo/vector-icons';

const Category = () => {
  const [categories, setCategories] = useState<CategoryCardProp[]>([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getAllCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const response = await CategoryService.getAllCategories();
      console.log('Categories fetched:', response);
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const fetchPromptsByCategory = async (categoryId: string) => {
    try {
      setIsLoadingPrompts(true);
      const response = await CategoryService.getCategoryPrompts(categoryId);
      console.log('Prompts by category fetched:', response);
      if (response.success && response.data) {
        // Transform the data to ensure it has the correct structure
        const transformedPrompts = response.data.map((prompt: any) => ({
          ...prompt,
          id: prompt.id || prompt._id, // Ensure id field exists
          category: typeof prompt.category === 'object' ? prompt.category.name : prompt.category,
          likeCount: prompt.likeCount || 0,
          bookmarkCount: prompt.bookmarkCount || 0,
          views: prompt.views || 0,
        }));
        setPrompts(transformedPrompts);
      } else {
        setPrompts([]);
      }
    } catch (error) {
      console.error('Error fetching prompts by category:', error);
      setPrompts([]);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchPromptsByCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setPrompts([]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedCategory) {
      await fetchPromptsByCategory(selectedCategory);
    } else {
      await getAllCategories();
    }
    setRefreshing(false);
  }, [selectedCategory]);

  const handleLike = (promptId: string) => {
    Alert.alert('Like', `Liked prompt: ${promptId}`, [{ text: 'OK' }]);
  };

  const handleBookmark = (promptId: string) => {
    Alert.alert('Bookmark', `Bookmarked prompt: ${promptId}`, [{ text: 'OK' }]);
  };

  const getCategoryColor = (color: string) => {
    const colors: { [key: string]: [string, string] } = {
      blue: ['#3B82F6', '#1E40AF'],
      green: ['#10B981', '#047857'],
      purple: ['#8B5CF6', '#6D28D9'],
      red: ['#EF4444', '#B91C1C'],
      yellow: ['#F59E0B', '#D97706'],
      pink: ['#EC4899', '#BE185D'],
      indigo: ['#6366F1', '#4338CA'],
      teal: ['#14B8A6', '#0F766E'],
    };
    return colors[color] || colors.blue;
  };

  const renderCategoryCard = ({ item }: { item: CategoryCardProp }) => {
    const gradientColors = getCategoryColor(item.color);

    return (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item._id)}
        className="w-[48%] mb-4"
      >
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 16, minHeight: 140 }}
          >
            {/* Icon */}
            <View className="mb-3">
              <Image
                source={{ uri: item.icon }}
                className="w-12 h-12"
              />
            </View>

            {/* Category Name */}
            <Text className="text-white font-bold text-lg mb-1">
              {item.name}
            </Text>

            {/* Prompt Count */}
            <View className="flex-row items-center">
              <Grid size={14} color="#FFFFFF" />
              <Text className="text-white/90 text-sm ml-1">
                {item.promptCount || 0} prompts
              </Text>
            </View>

            {/* Featured Badge */}
            {item.promptCount > 10 && (
              <View className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  Popular
                </Text>
              </View>
            )}
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderPromptCard = ({ item }: { item: Prompt }) => (
    <PromptCard item={item} onLike={handleLike} onBookmark={handleBookmark} />
  );

  if (isFetchingCategories) {
    return <LoadingSpinner fullScreen />;
  }

  // Show prompts view when a category is selected
  if (selectedCategory) {
    const selectedCat = categories.find((cat) => cat._id === selectedCategory);

    return (
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">


          <View className="flex-row items-center  gap-2">
             <TouchableOpacity
            onPress={handleBackToCategories}
            className="mb-3"
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
            <Image
              source={{ uri: selectedCat?.icon }}
              className="w-10 h-10 mr-2"
            />
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {selectedCat?.name}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {selectedCat?.description || 'Explore prompts in this category'}
              </Text>
            </View>
          </View>
        </View>

        {/* Prompts List */}
        {isLoadingPrompts ? (
          <LoadingSpinner fullScreen />
        ) : (
          <FlatList
            data={prompts}
            renderItem={renderPromptCard}
            keyExtractor={(item, index) =>
              item.id || item._id || index.toString()
            }
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
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-6xl mb-4">📭</Text>
                <Text className="text-lg font-semibold text-gray-600 mb-2">
                  No prompts in this category
                </Text>
                <Text className="text-base text-gray-500 text-center px-6">
                  Be the first to create a prompt in this category!
                </Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  // Show categories grid view
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Categories 🗂️
        </Text>
        <Text className="text-base text-gray-600 mt-1">
          Explore prompts by category
        </Text>
      </View>

      {/* Stats Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Grid size={18} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {categories.length} categories
            </Text>
          </View>
          <View className="flex-row items-center">
            <TrendingUp size={18} color="#10B981" />
            <Text className="text-sm text-gray-600 ml-2">
              {categories.reduce((sum, cat) => sum + (cat.promptCount || 0), 0)}{' '}
              total prompts
            </Text>
          </View>
        </View>
      </View>

      {/* Categories Grid */}
      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}
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
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">📂</Text>
            <Text className="text-lg font-semibold text-gray-600 mb-2">
              No categories available
            </Text>
            <Text className="text-base text-gray-500 text-center px-6">
              Categories will appear here once they are created
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Category;