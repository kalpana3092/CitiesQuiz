import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import HomeViewStyle from './HomeView.style';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Capitals from '../assets/files/capitalCities.json';
import * as ImgConstant from '../utilities/constant/ImageConstant';
import { Marker } from 'react-native-maps';
import { getDistance, getPreciseDistance } from 'geolib';
import { MapStyle } from '../utilities/constant/MapStyle';

const HomeView = () => {
    const rangeDistanceInMeters = 50000;
    const [totalScore, setTotalScore] = useState(1500);
    const [citiesPlaced, setCitiesPlacedCount] = useState(0);
    const [currentCounter, setCounter] = useState(0);
    const [currentCity, setCity] = useState({});
    const cities = Capitals.capitalCities;
    const [location, setLocation] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163
    });
    const [region, setRegion] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
    })

    useEffect(() => {
        if (cities != undefined) {
            if (cities.length > currentCounter) {
                setCity(cities[currentCounter]);
            }
        }
    }, [cities]);

    const gamePostionValidator = () => {
        if (totalScore > 0) {
            var place = cities[currentCounter]
            var distance = getDistance(
                { latitude: place.lat, longitude: place.long },
                { latitude: location.latitude, longitude: location.longitude },
            );
            if (distance <= rangeDistanceInMeters) {
                Alert.alert("Congratulation!!", "you are selected right place")
                if (cities.length > currentCounter) {
                    setCity(cities[currentCounter + 1]);
                    setCounter(currentCounter + 1)
                    setCitiesPlacedCount(citiesPlaced + 1)
                }
            } else {
                Alert.alert('Error', "You are selected far away distance, Please try again")
            }
            var noOfKm = distance / 1000
            var finalScore = totalScore - noOfKm
            if (finalScore > 0) {
                setTotalScore(finalScore)
            } else {
                setTotalScore(0)
            }
        } else {
            Alert.alert('Game Over!!!', "You dont have enough point to play the game")
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
                provider={PROVIDER_GOOGLE}
                customMapStyle={MapStyle}
                region={region}
                initialRegion ={region}
                
                onRegionChangeComplete={region => {
                    setRegion(region)
                    setLocation(
                        {
                            latitude: region.latitude,
                            longitude: region.longitude
                        })
                }}>
                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    image = {ImgConstant.IMG_MARKER}
                    // pinColor="green"
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