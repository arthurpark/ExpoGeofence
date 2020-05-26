import React, { useState, useEffect } from 'react';
import { AsyncStorage, Text, Button, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Stack, Box, Spacer, Columns } from './components';

// const MOCK_DATA = new Map<string, ListItem>([
//   [
//     'Test',
//     {
//       status: 'off',
//       name: 'Test',
//       message: '#1963',
//       region: {
//         identifier: 'Test',
//         radius: 50,
//         latitude: 33.87731177533466,
//         longitude: -117.98606408480681,
//         notifyOnEnter: true,
//         notifyOnExit: true,
//       },
//     },
//   ],
// ]);

const TASK_NAME = 'HereHereTest';

TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
  if (error) {
    // check `error.message` for more details.
    console.log('[TASK MANAGER ERROR]', error);
    return;
  }

  console.log('TASK MANAGER', data);

  const { eventType, region } = data;

  AsyncStorage.getItem(region.identifier, (error, result) => {
    const item = JSON.parse(result);
    const time = new Date().getTime();

    switch (eventType) {
      case Location.GeofencingEventType.Enter: {
        console.log("You've entered region:", region);
        Alert.alert('Entered', `You've entered region: ${region.identifier}`);
        break;
      }
      case Location.GeofencingEventType.Exit: {
        console.log("You've left region:", region);
        Alert.alert('Left', `You've left region: ${region.identifier}`);
        break;
      }
      default:
        break;
    }
  });
});

// TaskManager.getRegisteredTasksAsync().then((tasks) =>
//   console.log('[Registered TASKS]', tasks)
// );

export function Test() {
  const [tasks, setTasks] = useState([]);
  const [location, setLocation] = useState(null);
  const [watch, setWacth] = useState(true);

  async function getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(
      Permissions.LOCATION
    );

    return { status, permissions };
    // if (status === 'granted') {
    //   // return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    //   cb();
    // } else {
    //   throw new Error('Location permission not granted');
    // }
  }

  useEffect(() => {
    // Location.stopGeofencingAsync(TASK_NAME);
    // Location.startGeofencingAsync(TASK_NAME, [
    //   {
    //     identifier: 'Test',
    //     radius: 5,
    //     latitude: 33.87731177533466,
    //     longitude: -117.98606408480681,
    //     notifyOnEnter: true,
    //     notifyOnExit: true,
    //   },
    // ]);
    // Alert.alert('Test', `Body`);
    TaskManager.getRegisteredTasksAsync().then((tasks) => {
      console.log('[Registered TASKS]', tasks);
      setTasks(tasks);
    });
  }, []);

  useEffect(() => {
    let cleanupFn;

    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (watch) {
        const { remove } = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 10000,
            distanceInterval: 5,
            mayShowUserSettingsDialog: true,
          },
          (data) => {
            setLocation(data);
          }
        );

        cleanupFn = remove;
      }
    })();

    return function cleanup() {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [watch]);

  return (
    <Stack alignItems="center" justify="center" style={{ flex: 1 }}>
      <Box padding={{ v: 7 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Test</Text>

        <Spacer height={30} />
        <Box padding={{ a: 4 }}>
          {location && <Text>{`Lat: ${location.coords.latitude}`}</Text>}
          {location && <Text>{`Lng: ${location.coords.longitude}`}</Text>}
        </Box>
        <Spacer flex={1} />

        <Box padding={{ a: 4 }}>
          {tasks.map((task, ix) => (
            <Stack key={ix} padding={{ v: 3 }}>
              <Columns padding={{ v: 2 }}>
                <Text>{task.taskType}</Text>
                <Spacer width={60} />
                <Text>{task.taskName}</Text>
              </Columns>
              <Box>
                <Text>{JSON.stringify(task.options)}</Text>
              </Box>
            </Stack>
          ))}
        </Box>
        <Spacer flex={1} />

        <Button
          title="Start"
          color="blue"
          onPress={async () => {
            const { status, permissions } = await getLocationAsync();

            console.log('[PERMISSIONS]', status, permissions);

            if (status === 'granted') {
              if (location) {
                await Location.startGeofencingAsync(TASK_NAME, [
                  {
                    // identifier: 'Test',
                    radius: 1,
                    // latitude: 33.87731177533466,
                    // longitude: -117.98606408480681,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    // notifyOnEnter: true,
                    // notifyOnExit: true,
                  },
                ]);
                TaskManager.getRegisteredTasksAsync().then((tasks) => {
                  console.log('[Registered TASKS]', tasks);
                  setTasks(tasks);
                });
              }
            } else {
              console.log('ERROR');
            }
          }}
        />

        <Spacer height={30} />
        <Button
          title="Stop"
          color="red"
          onPress={async () => {
            await Location.stopGeofencingAsync(TASK_NAME);
            TaskManager.getRegisteredTasksAsync().then((tasks) => {
              console.log('[Registered TASKS]', tasks);
              setTasks(tasks);
            });
          }}
        />
      </Box>
    </Stack>
  );
}
