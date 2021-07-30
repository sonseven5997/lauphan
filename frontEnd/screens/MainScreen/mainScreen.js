import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';

export const Form = props => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formText}>{props.title}</Text>
      <TextInput
        onChangeText={props.onChange}
        style={styles.formTextInput}
        defaultValue={props.defaultValue}
      />
    </View>
  );
};

const MainScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [cityName, setCityName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');

  let maxPage;
  fetch('http://localhost:3333/restaurants/max-page')
    .then(res => res.text())
    .then(resText => (maxPage = resText));

  useEffect(() => {
    getData(1);
    setPage(page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = currentPage => {
    setIsLoading(true);
    var raw = '';
    var requestOptions = {
      method: 'GET',
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `http://localhost:3333/restaurants/page/${currentPage}`,
      requestOptions,
    )
      .then(response => (response.status === 200 ? response.json() : []))
      .then(result => {
        if (result.length !== 0) {
          setData(data.concat(result));
        }
        setIsLoading(false);
      })
      .catch(error => console.log('error', error));
  };

  const renderItem = ({item}) => {
    const deleteItem = async id => {
      var raw = '';

      var requestOptions = {
        method: 'DELETE',
        body: raw,
        redirect: 'follow',
      };

      await fetch(`http://localhost:3333/restaurants/id/${id}`, requestOptions);
      let deletedItemIndex = data.findIndex(e => e.id === item.id);
      let tempData = [...data];
      tempData.splice(deletedItemIndex, 1);
      setData(tempData);
    };

    const showAlert = () => {
      Alert.alert(
        'Xoá cửa hàng',
        'Bạn có chắc chắn muốn xoá cửa hàng?',
        [
          {
            text: 'OK',
            onPress: async () => {
              await deleteItem(item.id);
              Alert.alert('Đã xoá!');
            },
          },
          {
            text: 'Cancel',
          },
        ],
        {
          cancelable: true,
        },
      );
    };
    return (
      <View style={styles.viewContainer}>
        <TouchableOpacity
          style={{...styles.touchableContainer, height: screenHeight / 5}}
          onPress={() => {
            navigation.navigate('detailscreen', {id: item.id});
          }}
          onLongPress={() => {
            showAlert();
          }}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../images/logo-lauphan.jpeg')}
              style={styles.imageSize}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.cityName}>
              Lẩu Phan {item.address.cityName}
            </Text>
            <Text>
              {item.address.streetAddress} {item.address.cityName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <SafeAreaView>
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </SafeAreaView>
    );
  };

  const handleOnEndReached = () => {
    if (page <= maxPage) {
      setPage(page + 1);
      getData(page);
    }
  };

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleAddButton = () => {
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
        address: {streetAddress, cityName},
        email,
        phoneNumber,
        description,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch('http://localhost:3333/restaurants/', requestOptions)
        .then(response => response.json())
        .then(() => {
          let tempData = [...data];
          tempData.unshift({
            address: {streetAddress, cityName},
            email,
            phoneNumber,
            description,
          });
          setData(tempData);
        })
        .then(() => {
          showModal();
        })
        .catch(error => console.log('error', error));
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.viewContainerApp}>
        <TouchableOpacity style={styles.addNew} onPress={showModal}>
          <Text style={styles.addText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0}
      />
      <Modal isVisible={isModalVisible} onBackdropPress={showModal}>
        <View style={styles.backgroundWhite} scroll>
          <Text style={styles.modalTitle}>Thêm nhà hàng mới</Text>
          <Form
            title="Địa chỉ"
            onChange={text => {
              setStreetAddress(text);
            }}
          />
          <Form
            title="Thành phố"
            onChange={text => {
              setCityName(text);
            }}
          />
          <Form
            title="Email"
            onChange={text => {
              setEmail(text);
            }}
          />
          <Form
            title="Số điện thoại"
            onChange={text => {
              setPhoneNumber(text);
            }}
          />
          <Form
            title="Mô tả"
            onChange={text => {
              setDescription(text);
            }}
          />
          <View style={styles.buttonWrapper}>
            <Button
              title="Thêm"
              containerStyle={styles.buttonAddContainer}
              buttonStyle={styles.backgroundWhite}
              titleStyle={styles.titleColor}
              onPress={handleAddButton}
            />
            <Button
              title="Huỷ"
              containerStyle={styles.buttonCancelContainer}
              buttonStyle={styles.backgroundWhite}
              titleStyle={styles.titleColor}
              onPress={showModal}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {marginHorizontal: 10, marginBottom: 10},
  formText: {marginBottom: 5},
  formTextInput: {borderBottomWidth: 1},
  touchableContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    paddingLeft: 20,
  },
  viewContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  imageContainer: {justifyContent: 'center'},
  imageSize: {width: 100, height: 100},
  textWrapper: {justifyContent: 'center', marginLeft: 20},
  cityName: {fontSize: 25, marginBottom: 10},
  activityIndicator: {alignItems: 'center'},
  screenContainer: {marginBottom: 20},
  viewContainerApp: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 50,
  },
  addNew: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(132,209,254)',
  },
  addText: {fontSize: 20},
  backgroundWhite: {backgroundColor: '#FFFFFF'},
  modalTitle: {textAlign: 'center', fontSize: 20},
  buttonWrapper: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  buttonAddContainer: {flex: 1, borderRightWidth: 1, borderRadius: 0},
  titleColor: {color: 'blue'},
  buttonCancelContainer: {flex: 1, borderRadius: 0},
});

export default MainScreen;
