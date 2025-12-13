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

import Card from '@/components/ui/Card';
import { RegisterCredentials } from '@/types/auth.types';
import { APP_CONFIG } from '@/config/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from '@/components/forms/RegisterForm';
import { MaterialIcons } from '@expo/vector-icons';
import {KeyboardAwareScrollView} from "react-native-keyboard-controller"
import Logo from '@/components/ui/Logo';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      await register(credentials);
      router.replace('/(tabs)/home');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        className="flex-1"
           keyboardShouldPersistTaps="handled"
      >
        <View
        >
          {/* Header */}
          <View className="items-center mb-4">
             <Logo size={32} height={16} width={16}/>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Join us to get started with your journey
            </Text>
          </View>

          {/* Register Form */}
          <View className="bg-white rounded-xl ">
            <RegisterForm onSubmit={handleRegister} loading={isLoading} />
          </View>

          {/* Login Link */}
          <View className="items-center mt-6">
            <Text className="text-base text-gray-600">
              Already have an account?{' '}
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
