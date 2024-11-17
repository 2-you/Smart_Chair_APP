import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';
import Pomodoro from './component/pomodoro';

const Stack = createStackNavigator();

// HomeScreen 컴포넌트
const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({ name: '', height: '', weight: '' });

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        name: '홍길동',
        height: 175,
        weight: 70,
      };
      setUser(data);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <UserData user={user} />
      <PostureCorrectionButton navigation={navigation} />
      <PomodoroButton navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
};

const UserData = ({ user }) => (
  <View style={styles.userData}>
    <Text style={[tw`text-lg font-bold`, styles.userDataText]}>이름: {user.name}</Text>
    <Text style={[tw`text-lg`, styles.userDataText]}>키: {user.height}cm</Text>
    <Text style={[tw`text-lg`, styles.userDataText]}>몸무게: {user.weight}kg</Text>
  </View>
);

const PostureCorrectionButton = ({ navigation }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('PostureCorrection')}
  >
    <Text style={styles.cardText}>자세 교정</Text>
  </TouchableOpacity>
);

const PomodoroButton = ({ navigation }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('Pomodoro')}
  >
    <Text style={styles.cardText}>뽀모도로</Text>
  </TouchableOpacity>
);

// 메인 App 컴포넌트
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f0f4f7',
          },
          headerTintColor: '#007bff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈' }}
        />
        <Stack.Screen
          name="Pomodoro"
          component={Pomodoro}
          options={{ title: '뽀모도로 타이머' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  userData: {
    marginBottom: 100,
    alignItems: 'center',
  },
  userDataText: {
    color: '#333',
  },
  notificationIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
});