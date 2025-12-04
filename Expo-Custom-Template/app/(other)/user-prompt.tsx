import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ArrowLeft, FileText } from 'lucide-react-native'
import { PromptService } from '@/services/prompt.service'
import { Prompt } from '@/types/prompts.types'
import PromptCard from '@/components/cards/PromptCard'


const UserPrompt = () => {
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
const [loadMore, setloadMore] = useState(false);
const [index, setindex] = useState(1)
const top = 10;
  const fetchAllUserPrompts = async () => {
    try {
      setIsLoading(true)
      const res = await PromptService.getUserPrompts({index,top})
      if (res.success) {
        console.log("user prompts", res)
        setUserPrompts([...userPrompts, ...res.data])
        setloadMore(res.data.length === 10)
      }else{
        setloadMore(false);
      }
    } catch (error) {
      setloadMore(false);
      console.log("error in fetching user prompts", error)
    } finally {
      setIsLoading(false)
      console.log("loadmore is", loadMore)
    }
  }

  useEffect(() => {
    fetchAllUserPrompts()
  }, [index])

  const renderPromptCards = ({ item }: { item: Prompt }) => {
    return <PromptCard item={item} />
  }

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
        <FileText size={48} color="#3B82F6" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
        No Prompts Yet
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6">
        You haven't created any prompts yet. Start creating amazing prompts to see them here!
      </Text>
    </View>
  )
 const handleLoadMore = () => {
    if (loadMore && !isLoading) {
      console.log("loading more, current index:", index);
      setindex(prevIndex => prevIndex + 1);
    }
  }
  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-600 mt-4">Loading your prompts...</Text>
    </View>
  )

  return (
    <View className="flex-1 bg-gray-50" >
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">My Prompts</Text>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        renderLoadingState()
      ) : (
        <FlatList
          data={userPrompts}
          renderItem={renderPromptCards}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  )
}

export default UserPrompt