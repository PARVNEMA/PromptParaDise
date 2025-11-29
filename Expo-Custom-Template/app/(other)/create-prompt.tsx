import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Upload, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PromptService } from '@/services/prompt.service';
import { CategoryService } from '@/services/category.service';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Category {
  _id: string;
  name: string;
}

export default function CreatePromptScreen() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.'
      );
    }
  };

  const fetchCategories = async () => {
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleImageOptions = () => {
    Alert.alert('Add Image', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return false;
    }
    if (!prompt.trim()) {
      Alert.alert('Validation Error', 'Please enter the prompt content');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return false;
    }
    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const promptData = {
        title: title.trim(),
        prompt: prompt.trim(),
        description: description.trim(),
        category: selectedCategory,
        image: image || '',
      };

      console.log('Submitting prompt:', promptData);
      const response = await PromptService.postPrompts(promptData);
      console.log('Prompt created:', response);

      Alert.alert('Success', 'Prompt created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating prompt:', error);
      Alert.alert('Error', 'Failed to create prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 flex-1">
            Create Prompt
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <Card variant="elevated" padding="lg">
            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Title *
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
                placeholder="Enter a catchy title"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <Text className="text-xs text-gray-500 mt-1">
                {title.length}/100
              </Text>
            </View>

            {/* Prompt Content Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Prompt Content *
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
                placeholder="Enter your prompt here..."
                placeholderTextColor="#9CA3AF"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={2000}
              />
              <Text className="text-xs text-gray-500 mt-1">
                {prompt.length}/2000
              </Text>
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Description *
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-900"
                placeholder="Describe what this prompt does..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text className="text-xs text-gray-500 mt-1">
                {description.length}/500
              </Text>
            </View>

            {/* Category Selection */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Category *
              </Text>
              {isFetchingCategories ? (
                <View className="bg-gray-100 rounded-lg px-4 py-3 items-center">
                  <ActivityIndicator size="small" color="#3B82F6" />
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category._id}
                      onPress={() => setSelectedCategory(category._id)}
                      className={`mr-2 px-4 py-2 rounded-full border ${
                        selectedCategory === category._id
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedCategory === category._id
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Image Upload */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Image (Optional)
              </Text>

              {image ? (
                <View className="relative">
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 12,
                      resizeMode: 'cover',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleImageOptions}
                  className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg py-12 items-center justify-center"
                >
                  <Upload size={40} color="#9CA3AF" />
                  <Text className="text-gray-600 font-medium mt-2">
                    Tap to add image
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Take photo or choose from library
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Submit Button */}
            <Button
              title={isLoading ? 'Creating...' : 'Create Prompt'}
              onPress={handleSubmit}
              variant="primary"
              disabled={isLoading}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
