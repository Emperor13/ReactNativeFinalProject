import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Icon } from "@rneui/base";
import { Picker } from "@react-native-picker/picker";
import { StyleHome } from "../styles/styles";

// กำหนด interface สำหรับข้อมูล
interface Data {
  id: string;
  title: string;
  description: string;
  image: string;
}

// ข้อมูลการเดินทาง
const travelData: Data[] = [
  {
    id: "1",
    title: "Tokyo, Ameyoko",
    description: "The best market in Japan",
    image: "https://drive.google.com/uc?id=1jmS_Qt_FA1VIXhtnll0hmLjMjjA8vhki",
  },
  {
    id: "2",
    title: "Singapore, Merlion Park",
    description: "Marina Bay Waterfront Park",
    image: "https://drive.google.com/uc?id=1QY0HAJv73D8aP-WSOwr36EXqHQaGEunA",
  },
  {
    id: "3",
    title: "Bangkok, Siam Paragon",
    description: "A luxury shopping mall in the heart of Bangkok",
    image: "https://drive.google.com/uc?id=1_tlA6IcXs3qP5_6G6g-fwt0KRAwkwP6H",
  },
];

// ข้อมูลสินค้ายอดนิยม
const trendingData: Data[] = [
  {
    id: "4",
    title: "Hakata Nakanaka Dry",
    description: "Price: 1,080 JPY",
    image: "https://drive.google.com/uc?id=1NsIb__gPC-MAhzd5hAIfVJNyw9jfIsEI",
  },
  {
    id: "5",
    title: "The Golden Duck",
    description: "Price: 39 SGD (box of 5 bags)",
    image: "https://drive.google.com/uc?id=1HZb8_JRtewW_In8nObffVdzPPxgLkwxG",
  },
  {
    id: "6",
    title: "Fried durian",
    description: "Price: 140 THB (500 g.)",
    image: "https://drive.google.com/uc?id=1GvYY7rKFLD1GQ2I_cbFFMNvV0F-WImUe",
  },
];

// ข้อมูลกิจกรรม
const activityData: Data[] = [
  {
    id: "7",
    title: "Hachiko Dog Statue (Tokyo)",
    description: "Visit the Hachiko dog statue",
    image: "https://drive.google.com/uc?id=1MCAtSEbk1669uMBMOv37t51iyDPFoa7w",
  },
  {
    id: "8",
    title: "Omni-Theatre",
    description: "Watch movies on a digital with 8K resolution.",
    image: "https://drive.google.com/uc?id=1ylyxoXxRPOc1sSE5pMCG8XTeP6juuYFk",
  },
  {
    id: "9",
    title: "Sealife Bangkok",
    description: "The largest aquarium in Southeast Asia",
    image: "https://drive.google.com/uc?id=1w1FZApMZ9ruWm6-6HLO4fkdfJMUdr33x",
  },
];

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Travel");

  // เลือกข้อมูลตามหมวดหมู่
  const getDataForCategory = () => {
    switch (selectedCategory) {
      case "Trending":
        return trendingData;
      case "Activities":
        return activityData;
      default:
        return travelData;
    }
  };

  // กำหนดประเภทให้กับ item
  const renderItem = ({ item }: { item: Data }) => (
    <View style={StyleHome.card}>
      <Image source={{ uri: item.image }} style={StyleHome.cardImage} />
      <View style={StyleHome.cardTextContainer}>
        <Text style={StyleHome.cardTitle}>{item.title}</Text>
        <Text style={StyleHome.cardDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={StyleHome.container}>
      {/* Header */}
      <View style={StyleHome.header}>
        <Icon name="menu" size={30} color="white" />
        <Text style={StyleHome.headerTitle}>RateXChange</Text>
        <View style={StyleHome.headerIcons}>
          <Icon name="user" type="feather" size={25} color="white" />
          <Icon
            name="bell"
            type="feather"
            size={25}
            color="white"
            style={StyleHome.iconSpacing}
          />
        </View>
      </View>

      {/* Logo */}
      <View style={StyleHome.logoContainer}>
      <Image source={require("../assets/Logo.png")} style={StyleHome.logoImage} />
      <Text style={StyleHome.logoText}>RateXChange</Text>
      </View>

      {/* Convert Button */}
      <TouchableOpacity style={StyleHome.convertButton}>
        <Text style={StyleHome.convertButtonText}>Convert</Text>
      </TouchableOpacity>

      {/* Travel Section */}
      <View style={StyleHome.travelSection}>
        {/* Dropdown for selecting category */}
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={StyleHome.picker}
        >
          <Picker.Item label="Travel" value="Travel" />
          <Picker.Item label="Trending Items" value="Trending" />
          <Picker.Item label="Activities" value="Activities" />
        </Picker>

        {/* แสดงข้อมูลตามหมวดหมู่ที่เลือก */}
        <FlatList
          data={getDataForCategory()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
