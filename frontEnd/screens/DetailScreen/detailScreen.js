import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {Form} from '../MainScreen/mainScreen';
import {Button} from 'react-native-elements';

const DetailScreen = ({route}) => {
  const id = route.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isShowStaff, setIsShowStaff] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [cityName, setCityName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const getDataById = async () => {
      var raw = '';

      var requestOptions = {
        method: 'GET',
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        `http://localhost:3333/restaurants/id/${id}`,
        requestOptions,
      );
      const resJson = await response.json();
      if (response.status === 200) {
        setData(resJson);
        setStreetAddress(resJson.address.streetAddress);
        setCityName(resJson.address.cityName);
        setEmail(resJson.email);
        setPhoneNumber(resJson.phoneNumber);
        setDescription(resJson.description);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    getDataById();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditButton = () => {
    if (
      streetAddress !== '' &&
      cityName !== '' &&
      email !== '' &&
      phoneNumber !== '' &&
      description !== ''
    ) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        address: {
          streetAddress: streetAddress,
          cityName: cityName,
        },
        email: email,
        phoneNumber: phoneNumber,
        description: description,
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`http://localhost:3333/restaurants/id/${id}`, requestOptions).then(
        res => {
          if (res.status === 200) {
            setData({
              ...data,
              address: {streetAddress, cityName},
              email,
              phoneNumber,
              description,
            });
          } else {
            Alert.alert('Không thể thực hiện thay đổi');
          }
        },
      );
    }
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderStaff = list => {
    return list.map((e, i) => {
      if (e !== undefined) {
        return (
          <View key={i.toString()}>
            <Text style={styles.staffText}>{i + 1}</Text>
            <Text style={styles.staffText}>Name: {e.name}</Text>
            <Text style={styles.staffText}>Gender: {e.gender}</Text>
            <Text style={styles.staffText}>Age: {e.age}</Text>
            <Text style={styles.staffText}>Job: {e.jobTitle}</Text>
          </View>
        );
      }
    });
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.touchableContainer}
        onLongPress={() => {
          setIsModalVisible(true);
        }}>
        <View style={styles.textWrapper}>
          <Text style={styles.cityName}>Lẩu Phan {data.address.cityName}</Text>
        </View>
        <Text style={styles.contentText}>
          Địa chỉ {data.address.streetAddress} {data.address.cityName}
        </Text>
        <Text style={styles.contentText}>Email {data.email}</Text>
        <Text style={styles.contentText}>Phone number {data.phoneNumber}</Text>
        <Text style={styles.contentText}>Mô tả: "{data.description}"</Text>
        <TouchableOpacity
          onPress={() => {
            setIsShowStaff(!isShowStaff);
          }}>
          <Text style={styles.contentText}>
            {data.staffs !== undefined
              ? `Nhân viên: ${data.staffs.length}`
              : null}
          </Text>
        </TouchableOpacity>
        {isShowStaff ? (
          <ScrollView>{renderStaff(data.staffs)}</ScrollView>
        ) : null}
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setIsModalVisible(false);
        }}>
        <View style={styles.backgroundWhite} scroll>
          <Text style={styles.titleModal}>Thêm nhà hàng mới</Text>
          <Form
            title="Địa chỉ"
            defaultValue={streetAddress}
            onChange={text => {
              setStreetAddress(text);
            }}
          />
          <Form
            title="Thành phố"
            defaultValue={cityName}
            onChange={text => {
              setCityName(text);
            }}
          />
          <Form
            title="Email"
            defaultValue={email}
            onChange={text => {
              setEmail(text);
            }}
          />
          <Form
            title="Số điện thoại"
            defaultValue={phoneNumber}
            onChange={text => {
              setPhoneNumber(text);
            }}
          />
          <Form
            title="Mô tả"
            defaultValue={description}
            onChange={text => {
              setDescription(text);
            }}
          />
          <View style={styles.buttonWrapper}>
            <Button
              title="Sửa"
              containerStyle={styles.buttonEditContainer}
              buttonStyle={styles.backgroundWhite}
              titleStyle={styles.colorBlue}
              onPress={() => {
                handleEditButton();
                setIsModalVisible(false);
              }}
            />
            <Button
              title="Huỷ"
              containerStyle={styles.buttonCancelContainer}
              buttonStyle={styles.backgroundWhite}
              titleStyle={styles.colorBlue}
              onPress={() => {
                setIsModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  staffText: {fontSize: 12, marginBottom: 5},
  touchableContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
  },
  textWrapper: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cityName: {fontSize: 30, textAlign: 'center'},
  contentText: {fontSize: 15, marginBottom: 10},
  backgroundWhite: {backgroundColor: '#FFFFFF'},
  titleModal: {textAlign: 'center', fontSize: 20},
  buttonWrapper: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  buttonEditContainer: {flex: 1, borderRightWidth: 1, borderRadius: 0},
  colorBlue: {color: 'blue'},
  buttonCancelContainer: {flex: 1, borderRadius: 0},
});

export default DetailScreen;
