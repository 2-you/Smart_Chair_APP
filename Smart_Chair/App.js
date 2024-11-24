import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import Pomodoro from './components/pomodoro/pomodoro';
import PostureCorrection from './components/posture/PostureCorrection';

const Stack = createStackNavigator();

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
    <LinearGradient
      colors={['#ffffff', '#e1f5fe', '#81d4fa']}
      style={styles.gradientContainer}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={[tw`text-6xl font-bold mb-2`, styles.title]}>
              Smart Chair
            </Text>
          </View>

          <UserData user={user} />
          <PostureCorrectionButton navigation={navigation} />
          <PomodoroButton navigation={navigation} />
          <StatusBar style="dark" />
        </View>
      </View>
    </LinearGradient>
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
        <Stack.Screen
          name="PostureCorrection"
          component={PostureCorrection}
          options={{ title: '자세 교정' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -40,
  },
  title: {
    color: '#2196f3',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: Platform.OS === 'ios' ? 'AppleSDGothicNeo-Bold' : 'sans-serif-medium',
    letterSpacing: 2,
  },
  userData: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userDataText: {
    color: '#333',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
  },
});