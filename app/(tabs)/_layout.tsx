import { Tabs } from 'expo-router';
import React from 'react';

import { HomeIcon, InboxIcon, NotiIcon, SearchIcon, UserIcon } from '@/components/ui/Icons';

export default function TabLayout() {

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'white',
            height: 'auto',
          },
          tabBarActiveTintColor: '#3D5DC7',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <SearchIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
            tabBarIcon: ({ color }) => <InboxIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notificaciones',
            tabBarIcon: ({ color }) => <NotiIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <UserIcon color={color} />,
          }}
        />
      </Tabs>

    </>
  );
}
