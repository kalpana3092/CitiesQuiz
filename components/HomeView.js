import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { getDistance, getPreciseDistance } from 'geolib';
import * as Capitals from '../assets/files/capitalCities.json';
import * as ImgConstant from '../utilities/constant/ImageConstant';
import HomeViewStyle from './HomeView.style';
import { MapStyle } from '../utilities/constant/MapStyle';
import * as StrConstant from '../utilities/constant/StringConstant'

const HomeView = () => {
    //acurracy of selction
    const rangeDistanceInMeters = 50000;

    // user predetermined score
    const [totalScore, setTotalScore] = useState(1500);

    // number of cities placed by user
    const [citiesPlaced, setCitiesPlacedCount] = useState(0);

    // to retrived city from city list
    const [currentCounter, setCounter] = useState(0);

    // city to select
    const [currentCity, setCity] = useState({});

    // list of cities
    const cities = Capitals.capitalCities;

    // to update marker on map
    const [location, setLocation] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163
    });

    // to update current region on map
    const [region, setRegion] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163,
        latitudeDelta: 20,
        longitudeDelta: 20
    })

    useEffect(() => {
        if (cities != undefined) {
            if (cities.length > currentCounter) {
                setCity(cities[currentCounter]);
            }
        }
    }, [cities]);

    /**
    * Called on click of place button to validate user selection
    */
    const gamePostionValidator = () => {
        if (totalScore > 0) {
            var place = cities[currentCounter]
            var distance = getDistance(
                { latitude: place.lat, longitude: place.long },
                { latitude: location.latitude, longitude: location.longitude },
            );
            if (distance <= rangeDistanceInMeters) {
                Alert.alert(StrConstant.TITLE_CONGRATS, StrConstant.STR_CORRECT)
                if (cities.length > currentCounter) {
                    setCity(cities[currentCounter + 1]);
                    setCounter(currentCounter + 1)
                    setCitiesPlacedCount(citiesPlaced + 1)
                }
            } else {
                setLocation(
                    {
                        latitude: place.lat,
                        longitude: place.long
                    })
                    
                    var noOfKm = distance / 1000
                    let messageStr = 'You are ' + noOfKm + ' km' + ' distance away from your target'
                    Alert.alert(
                        StrConstant.TITLE_ERROR,
                        messageStr,
                        [
                          { text: "OK", onPress: () => {
                            setCity(cities[currentCounter + 1]);
                            setCounter(currentCounter + 1)
                          } }
                        ]
                      );
            }
            var noOfKm = distance / 1000
            var finalScore = totalScore - noOfKm
            if (finalScore > 0) {
                setTotalScore(finalScore)
            } else {
                setTotalScore(0)
            }
        } else {
            Alert.alert(StrConstant.TITLE_GAMEOVER, StrConstant.STR_GAMEOVER)
        }
    }
    return (
        <SafeAreaView style={HomeViewStyle.safeArea}>
            <View style={HomeViewStyle.topContainer}>
                <View style={HomeViewStyle.textContainer}>
                    <Text style={HomeViewStyle.placeButtonTitle}> {citiesPlaced + ' cities placed'}</Text>
                </View>
                <View style={HomeViewStyle.textContainer}>
                    <Text style={HomeViewStyle.placeButtonTitle}>{ parseFloat(totalScore).toFixed(0) + ' kilometers left'}</Text>
                </View>
                <View style={HomeViewStyle.cityTextContainer}>
                    <Text style={HomeViewStyle.textTitle}> {currentCity != undefined ? "select the location of \n" + currentCity.capitalCity : ""} </Text>
                </View>
            </View>
            <MapView
                style={HomeViewStyle.mapView}
                // To show google map
                provider={PROVIDER_GOOGLE}
                // To to show Only Country-borders 
                customMapStyle={MapStyle}
                region={region}
                initialRegion ={region}
                onPress={(e) => {
                    console.log(e.nativeEvent.coordinate)
                    setLocation(
                        {
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude
                        })
                }}
                // onRegionChangeComplete={region => {
                //     console.log(region)
                //     setRegion(region)
                //     setLocation(
                //         {
                //             latitude: region.latitude,
                //             longitude: region.longitude
                //         })
                // }}
                >
                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    image = {ImgConstant.IMG_MARKER}
                />
            </MapView>
            <View style={HomeViewStyle.plusminusButtonContainer}>
                <TouchableOpacity style={HomeViewStyle.plusminusButton}
                    onPress={() => {setRegion((val)=>{
                        return {...val,latitudeDelta: val.latitudeDelta/5, longitudeDelta: val.longitudeDelta/5}
                    })}}>
                    <Text style={HomeViewStyle.plusButtonTitle}>+</Text>
                </TouchableOpacity>
                <View style={{height: 2}}/>
                <TouchableOpacity style={HomeViewStyle.plusminusButton}
                    onPress={() => {setRegion((val)=>{
                        return {...val,latitudeDelta: val.latitudeDelta*5, longitudeDelta: val.longitudeDelta*5}
                    })}}>
                    <Text style={HomeViewStyle.plusButtonTitle}>-</Text>
                </TouchableOpacity>
            </View>
            <View style={HomeViewStyle.buttonContainer}>
                <TouchableOpacity style={HomeViewStyle.placeButton}
                    onPress={() => gamePostionValidator()}>
                    <Text style={HomeViewStyle.placeButtonTitle}>place</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default HomeView