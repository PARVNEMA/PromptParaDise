import React, { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import UpdateModal from '@/components/ui/UpdateModal';

SplashScreen.preventAutoHideAsync();
export const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  });
  return (
    <SafeAreaView className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(other)" />
        </Stack.Protected>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default function RootLayout() {
  useFrameworkReady();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDownloadingUpdate, setIsDownloadingUpdate] = useState(false);

  // useEffect(() => {
  //   async function onFetchUpdateAsync() {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();

  //       if (update.isAvailable) {
  //         setIsUpdateModalVisible(true);
  //       }
  //     } catch (error) {
  //       console.error(`Error fetching latest Expo update: ${error}`);
  //     }
  //   }
  //   onFetchUpdateAsync();
  // }, []);

  const handleDownloadUpdate = async () => {
    setIsDownloadingUpdate(true);
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.error(`Error downloading or reloading update: ${error}`);
      setIsDownloadingUpdate(false);
      setIsUpdateModalVisible(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdateModalVisible(false);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainLayout />
        <UpdateModal
          visible={isUpdateModalVisible}
          onDownload={handleDownloadUpdate}
          onCancel={handleCancelUpdate}
          isDownloading={isDownloadingUpdate}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}
