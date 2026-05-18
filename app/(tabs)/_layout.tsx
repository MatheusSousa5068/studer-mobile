import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TabIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} {...props} />;
}

const NAV_DARK = {
  headerStyle: { backgroundColor: '#000000' },
  headerTintColor: '#f4f4f5',
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '500' as const, fontSize: 15 },
  tabBarStyle: {
    backgroundColor: '#000000',
    borderTopColor: '#222222',
    borderTopWidth: 1,
  },
  tabBarActiveTintColor: '#0070f3',
  tabBarInactiveTintColor: '#52525b',
  tabBarLabelStyle: { fontSize: 11, fontWeight: '500' as const },
};

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs screenOptions={NAV_DARK}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color }) => <TabIcon name="star-o" color={color} />,
          }}
        />
        <Tabs.Screen
          name="collections"
          options={{
            title: 'Collections',
            tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <TabIcon name="bar-chart" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
