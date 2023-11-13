import { View, Text, Button } from 'react-native';
import WeatherChart from '../../components/WeatherChart';
import { useEffect, useState } from 'react';
import { getForecast } from '../../apis/api-weather';
import { DEFAULT_LOCATION, DEFAULT_CITY_NAME } from '../../constants';
import ChangeModal from './ChangeModal';
import { buildCityText, getTemperatureDomain } from '../../utils';
import { styles } from './styles';

const WeatherPage = () => {
  const [data, setData] = useState();
  const [city, setCity] = useState(DEFAULT_CITY_NAME);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [modalVisible, setModalVisible] = useState(false);
  const [isShowTemperature, setIsShowTemperature] = useState(true);

  useEffect(() => {
    getForecast(location).then((res) => {
      setData(res.data);
    });
  }, [location])

  const hours = data ? data.hourly.time : [];
  const temperatures = data ? data.hourly.temperature_2m : [];
  const rainProbabilities = data ? data.hourly.precipitation_probability : [];
  const apparentTemperature = data ? data.hourly.apparent_temperature : [];

  const onLocationSelected = (location) => {
    setLocation({ lat: location.latitude, long: location.longitude });
    setCity(buildCityText(location))
  }

  const changeView = () => {
    setIsShowTemperature(!isShowTemperature)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {city}
      </Text>
      <Button
        title={'Change Location'}
        onPress={() => setModalVisible(!modalVisible)}
      />

      <Button
        title={'Alterar Visualização'}
        onPress={() => changeView()}

      />
      <WeatherChart
        yDomain={isShowTemperature ? getTemperatureDomain(temperatures) : getTemperatureDomain(apparentTemperature)}
        hours={hours}
        values={isShowTemperature ? temperatures : apparentTemperature}
        color={{
          to: '#36d',
          from: '#d61',
          line: '#555'
        }}
        title={isShowTemperature ? 'Temperatura' : 'Sensação Termica'}
      />
      <WeatherChart
        yDomain={{ min: 0, max: 100 }}
        hours={hours}
        values={rainProbabilities}
        color={{
          to: '#ddf',
          from: '#14a',
          line: '#555'
        }}
        title={'Chance de preciptação (%)'}
      />
      <ChangeModal
        visible={modalVisible}
        onCloseRequest={() => setModalVisible(false)}
        onLocationSelected={onLocationSelected}
      />
    </View>
  );
}

export default WeatherPage;
