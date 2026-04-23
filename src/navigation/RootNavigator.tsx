import React, { useRef } from 'react';
import { View, Text, PanResponder, Image } from 'react-native';
import { NavigationContainer, NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import StoryScreen from '../screens/StoryScreen';
import RewardsScreen from '../screens/RewardsScreen';
import LandingScreen from '../screens/LandingScreen';
import { useApp } from '../context/AppContext';

const navHomeIcon = require('../../assets/nav-home (420x420).png');
const navReadIcon = require('../../assets/nav-read (420x420).png');
const navAwardsIcon = require('../../assets/nav-awards (420x420).png');

export type MainTabParamList = {
  Home: undefined;
  Play: undefined;
  Rewards: undefined;
};

export type RootStackParamList = {
  Landing: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Story: { storyId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TAB_ORDER: (keyof MainTabParamList)[] = ['Home', 'Play', 'Rewards'];

// Wraps a screen with left/right swipe to navigate between tabs.
function makeSwipable(Screen: React.ComponentType, tabIndex: number) {
  return function SwipableTab() {
    const navRef = useRef<BottomTabNavigationProp<MainTabParamList> | null>(null);
    const nav = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
    navRef.current = nav;

    const panResponder = useRef(
      PanResponder.create({
        // Only claim clearly horizontal gestures so vertical scroll still works
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 2.5,
        onPanResponderRelease: (_, g) => {
          if (Math.abs(g.dx) < 50) return;
          const n = navRef.current;
          if (!n) return;
          if (g.dx < 0 && tabIndex < TAB_ORDER.length - 1) {
            n.navigate(TAB_ORDER[tabIndex + 1]);
          } else if (g.dx > 0 && tabIndex > 0) {
            n.navigate(TAB_ORDER[tabIndex - 1]);
          }
        },
      })
    ).current;

    return (
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <Screen />
      </View>
    );
  };
}

const SwipableHome    = makeSwipable(HomeScreen,    0);
const SwipablePlay    = makeSwipable(MapScreen,     1);
const SwipableRewards = makeSwipable(RewardsScreen, 2);

function MainTabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#AAA',
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: {
            backgroundColor: '#D4E89E',
            borderTopColor: '#000',
            borderTopWidth: 1,
            height: 75,
            paddingBottom: 9,
            paddingTop: 10,
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 0,
          },
          tabBarLabelStyle: {
            fontFamily: 'Heebo_700Bold',
            fontSize: 11,
            color: '#000',
            marginTop: 4,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === 'Home') icon = navHomeIcon;
            else if (route.name === 'Play') icon = navReadIcon;
            else icon = navAwardsIcon;
            const isActive = color === '#FFD700';
            return <Image source={icon} style={{ width: 56, height: 56, opacity: isActive ? 1 : 0.6, resizeMode: 'contain' }} resizeMode="contain" />;
          },
        })}
      >
        <Tab.Screen name="Home"    component={SwipableHome}    options={{ tabBarLabel: 'בית' }} />
        <Tab.Screen name="Play"    component={SwipablePlay}    options={{ tabBarLabel: 'קרא' }} />
        <Tab.Screen name="Rewards" component={SwipableRewards} options={{ tabBarLabel: 'פרסים' }} />
      </Tab.Navigator>
    </View>
  );
}

function AppShell() {
  const { isTestMode } = useApp();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="Landing"  component={LandingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Story"    component={StoryScreen} />
      </Stack.Navigator>
      {isTestMode && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          backgroundColor: '#E65100', paddingVertical: 5,
          alignItems: 'center', zIndex: 999,
        }}>
          <Text style={{ color: '#fff', fontFamily: 'Heebo_700Bold', fontSize: 12 }}>
            🧪 מצב בדיקה פעיל — הנתונים לא נשמרים
          </Text>
        </View>
      )}
    </View>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <AppShell />
    </NavigationContainer>
  );
}
