import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import tw from 'twrnc';

const UserData = ({ user }) => (
  <View style={styles.userData}>
    <Text style={[tw`text-lg font-bold`, styles.userDataText]}>이름: {user.name}</Text>
    <Text style={[tw`text-lg`, styles.userDataText]}>키: {user.height}cm</Text>
    <Text style={[tw`text-lg`, styles.userDataText]}>몸무게: {user.weight}kg</Text>
  </View>
);

const NotificationIcon = () => (
  <View style={styles.notificationIcon}>
    <Text style={tw`text-4xl mt-5 mr-5`}>🔔</Text>
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

export default function App({ navigation }) {
  const [user, setUser] = useState({ name: '', height: '', weight: '' });

  useEffect(() => {
    // 예시 JSON 데이터
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
      <NotificationIcon />
      <UserData user={user} />
      <PostureCorrectionButton navigation={navigation} />
      <PomodoroButton navigation={navigation} />
      <StatusBar style="auto" />
    </View>
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