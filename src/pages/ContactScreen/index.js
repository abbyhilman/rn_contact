import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';

import Searchbar from '../../components/SearchBar';
import InputText from '../../components/InputText';
import Gap from '../../components/Gap';
import {
  getContact,
  setLoading,
  postContact,
  deleteById,
  editContact,
  getById,
} from '../../redux/action';
import {useForm, showMessage} from '../../utils';

const {width, height} = Dimensions.get('screen');

const Contact = () => {
  const dispatch = useDispatch();
  const {contact} = useSelector(state => state.homeReducer);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [form, setForm] = useForm({
    firstName: '',
    lastName: '',
    age: null,
    photo: '',
  });
  const [searchText, setSearchText] = useState('');

  const onSubmit = () => {
    this.RBSheet.close();
    dispatch(setLoading(true));
    dispatch(postContact(form));
    setForm('firstName', '');
    setForm('lastName', '');
    setForm('age', null);
    setForm('photo', '');
  };

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getContact());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(setLoading(true));
    dispatch(getContact());
  };

  const handleSearch = text => {
    const newData = contact.filter(item => {
      console.log(item);
      const itemData = `${item.firstName.toLowerCase()}   
    ${item.lastName.toLowerCase()} ${item.id} ${item.age} `;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
    setSearchText(text);
  };

  const deleteId = id => {
    console.log(id);
    dispatch(setLoading(true));
    dispatch(deleteById(id));
  };

  const onEdit = id => {
    this.RBSheetEdit.close();
    let resultObj = {};
    Object.keys(form).map(obj => {
      if (form[obj]) {
        resultObj[obj] = form[obj];
      }
    });
    dispatch(setLoading(true));
    dispatch(editContact(id, resultObj));
  };

  const ListContact = item => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            borderColor: '#ecf0f1',
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: 16,
              alignItems: 'center',
            }}>
            {item.photo === 'N/A' ? (
              <Image
                source={{
                  uri: 'https://source.unsplash.com/1600x900/?animal',
                }}
                style={styles.profile}
              />
            ) : (
              <Image
                source={{
                  uri: item.photo,
                }}
                style={styles.profile}
              />
            )}
            <View>
              <Text
                style={{
                  color: '#000',
                  marginLeft: 10,
                }}>{`${item.firstName} ${item.lastName}`}</Text>
              <Text
                style={{
                  color: '#000',
                  marginLeft: 10,
                }}>
                Age : {`${item.age}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.RBSheetEdit.open()}
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteId(item.id)}
            style={{
              marginLeft: RFValue(10),
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Icon name="ios-trash" size={30} />
          </TouchableOpacity>
          <RBSheet
            ref={ref => {
              this.RBSheetEdit = ref;
            }}
            closeOnDragDown={true}
            closeOnPressMask={true}
            closeOnPressBack={true}
            height={500}
            openDuration={250}
            customStyles={{
              container: {
                borderTopLeftRadius: RFValue(16),
                borderTopRightRadius: RFValue(16),
              },
            }}>
            <View>
              <InputText
                label="First Name"
                placeholder="Type your first name"
                value={form.firstName}
                onChangeText={value => setForm('firstName', value)}
              />
              <Gap height={16} />
              <InputText
                label="Last Name"
                placeholder="Type your laste name"
                value={form.lastName}
                onChangeText={value => setForm('lastName', value)}
              />
              <Gap height={16} />
              <InputText
                label="Age"
                placeholder="Type your age"
                textContentType="telephoneNumber"
                dataDetectorTypes="phoneNumber"
                keyboardType="phone-pad"
                value={form.age}
                onChangeText={value => setForm('age', value)}
              />
              <Gap height={16} />
              <InputText
                label="Photo"
                placeholder="Input Link Image"
                value={form.photo}
                onChangeText={value => setForm('photo', value)}
              />
              <Gap height={16} />
              <Button title="Edit" onPress={() => onEdit(item.id)} />
            </View>
          </RBSheet>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Searchbar
        value={searchText}
        placeholder={'Search Contact'}
        containerStyle={{
          width: width * 0.73,
          marginLeft: RFValue(-8),
        }}
        onClear={() => setSearchText('')}
        onChangeText={text => handleSearch(text)}
      />

      {searchText === '' ? (
        <FlatList
          data={contact}
          onRefresh={() => onRefresh()}
          refreshing={refresh}
          style={{marginTop: RFValue(10)}}
          renderItem={({item}) => ListContact(item)}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          data={data}
          style={{marginTop: RFValue(10)}}
          renderItem={({item}) => ListContact(item)}
          keyExtractor={item => item.id}
        />
      )}
      <Button
        title={'New Contact'}
        onPress={() => this.RBSheet.open()}
        style={{
          width: width * 0.9,
          alignSelf: 'center',
        }}
      />
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={500}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: RFValue(16),
            borderTopRightRadius: RFValue(16),
          },
        }}>
        <View>
          <InputText
            label="First Name"
            placeholder="Type your first name"
            value={form.firstName}
            onChangeText={value => setForm('firstName', value)}
          />
          <Gap height={16} />
          <InputText
            label="Last Name"
            placeholder="Type your laste name"
            value={form.lastName}
            onChangeText={value => setForm('lastName', value)}
          />
          <Gap height={16} />
          <InputText
            label="Age"
            placeholder="Type your age"
            keyboardType="phone-pad"
            value={form.age}
            onChangeText={number => {
              setForm('age', number);
            }}
          />
          <Gap height={16} />
          <InputText
            label="Photo"
            placeholder="Input Link Image"
            value={form.photo}
            onChangeText={value => setForm('photo', value)}
          />
          <Gap height={16} />
          <Button title="Submit" onPress={onSubmit} />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
});
