import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CategoryItemProps {
  name: string;
  pickCategory: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, pickCategory }) => {
  return (
    <TouchableOpacity onPress={pickCategory}>
      <View style={styles.container}>
        <Text style={{ fontSize: 15 }}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginVertical: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10
  }
});

export default CategoryItem;
