import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimeUntilArrivalWidget = (props) => {
  const { arrivalTime } = props;
  const [timeUntilArrival, setTimeUntilArrival] = useState(null);

  useEffect(() => {
    const calculateTimeUntilArrival = () => {
      const currentTime = new Date();
      const arrivalDateTime = new Date(arrivalTime);

      const timeDifference = arrivalDateTime - currentTime;

      // Convert the time difference to hours and minutes
      const hoursUntilArrival = Math.floor(timeDifference / (60 * 60 * 1000));
      const minutesUntilArrival = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));

      setTimeUntilArrival({ hours: hoursUntilArrival, minutes: minutesUntilArrival });
    };

    calculateTimeUntilArrival();
  }, [arrivalTime]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Time Until Arrival</Text>
      </View>
      {timeUntilArrival ? (
        <View style={styles.content}>
          <Text style={styles.timeText}>{timeUntilArrival.hours}h {timeUntilArrival.minutes}m</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Calculating...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
    margin: 10,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TimeUntilArrivalWidget;
