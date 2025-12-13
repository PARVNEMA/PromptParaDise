import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Link, router, useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/forms/LoginForm';
import Card from '@/components/ui/Card';
import { LoginCredentials } from '@/types/auth.types';
import { APP_CONFIG } from '@/config/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Logo from '@/components/ui/Logo';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const res=await login(credentials);
      if(res){

        router.replace('/(tabs)/home');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 pt-20"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex-grow justify-center px-3 "
        >
          {/* Header */}
          <View className="flex-col items-center text-center gap-4">
            {/* Logo Mark */}
            <Logo size={32} height={16} width={16}/>
            <View className="space-y-1">
              <Text className="text-text-main dark:text-text-main-dark tracking-tight text-3xl font-bold">
                PromptParaDise
              </Text>
              <Text className="text-text-main/80 dark:text-text-main-dark/80 text-base font-normal">
                Ignite your creativity.
              </Text>
            </View>
          </View>

          {/* Login Form */}
          <View className="p-6">
            <LoginForm onSubmit={handleLogin} loading={isLoading} />
          </View>

          {/* Register Link */}
          <View className="pt-4 text-center items-center">
            <Text className="text-text-main dark:text-text-main-dark text-base">
              New to PromptParaDise?{' '}
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity className=''>
                  <Text className="font-bold underline decoration-primary decoration-2 underline-offset-2 hover:text-primary">Sign up</Text>
                </TouchableOpacity>
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
