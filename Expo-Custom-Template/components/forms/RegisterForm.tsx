import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import * as ImagePicker from 'expo-image-picker'
import {
  User,
  Mail,
  Lock,
  CircleCheck as CheckCircle,
  Camera,
} from 'lucide-react-native';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { RegisterCredentials } from '@/types/auth.types';
import { VALIDATION_RULES } from '@/config/constants';
import KeyboardAvoidingWrapper from '../ui/KeyboardAvoidingWrapper';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(
        VALIDATION_RULES.NAME_MIN_LENGTH,
        `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`
      )
      .max(
        VALIDATION_RULES.NAME_MAX_LENGTH,
        `Name must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .regex(VALIDATION_RULES.EMAIL_REGEX, 'Please enter a valid email'),
    password: z
      .string()
      .min(
        VALIDATION_RULES.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
      ),

  })


interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleFormSubmit = async (data: RegisterCredentials) => {
    try {
      const registrationData = {
        ...data,
        avatar: avatarUri || undefined,
      };
      console.log('Register Form Data:', registrationData);
      await onSubmit(registrationData);
      reset();
      setAvatarUri(null);
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingWrapper className="p-4 w-full flex-1">
      <View className="w-full space-y-4">
        {/* Avatar Picker */}
        <View className="items-center mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-3">Profile Picture (Optional)</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="relative"
            activeOpacity={0.7}
          >
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-2 border-green-500">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={40} color="#9CA3AF" />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 border-2 border-white">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              leftIcon={<User size={20} color="#6B7280" />}
              autoCapitalize="words"
              autoComplete="name"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              leftIcon={<Mail size={20} color="#6B7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              leftIcon={<Lock size={20} color="#6B7280" />}
              secureTextEntry
              autoComplete="password-new"
            />
          )}
        />



        <View className="pt-2">
          <Button
            title="Create Account"
            onPress={handleSubmit(handleFormSubmit)}
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default RegisterForm;
