import { useAuth } from '@/features/auth/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();


  return !isAuthenticated ? <Redirect href="/auth/login" /> :
    (
      <>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              backgroundColor: '#161622',
              height: 'auto',
              borderTopWidth: 0.2,
              borderColor: '#6A6A70',
              paddingTop: 12,

              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarActiveTintColor: '#3D5DC7',
            tabBarInactiveTintColor: '#484C52',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="workspace"
            options={{
              title: 'Tablero',
              tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="inbox"
            options={{
              title: 'Inbox',
              tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="notifications"
            options={{
              title: 'Notificaciones',
              tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color={color} />,
            }}
          />
        </Tabs>

      </>
    );
}
