import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

const mockProducts = [
  {
    id: "com.mindleaf.leaves10",
    title: "10 Leaves Package",
    price: "$4.99",
    amount: 10
  },
  {
    id: "com.mindleaf.leaves25",
    title: "25 Leaves Package",
    price: "$9.99",
    amount: 25
  },
  {
    id: "com.mindleaf.leaves50",
    title: "50 Leaves Package",
    price: "$14.99",
    amount: 50
  }
];

const BuyLeavesPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (productId: string) => {
    setIsLoading(true);

    // Simulate purchase process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Leaves have been added to your account!");
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/leaf.png')} style={styles.image} />
            </View>
            <Text style={styles.title}>Buy Leaves</Text>
          </View>
          <Text style={styles.subtitle}>
            Purchase leaves to unlock more covers, extra voice minutes, one time reports and many more
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Processing purchase...</Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {mockProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.planBox}
                onPress={() => handlePurchase(product.id)}
              >
                <View style={styles.planContent}>
                  <Text style={styles.planName}>{product.title}</Text>
                  <Text style={styles.description}>
                    Get {product.amount} leaves
                  </Text>
                  <Text style={styles.priceText}>{product.price}</Text>
                  <View style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Purchase Now</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#FCFAF0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#FCFAF0',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Ovo',
    color: '#000',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    letterSpacing: 0.3,
    textAlign: 'center',
    alignSelf: 'center',
  },
  plansContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  planBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planContent: {
    alignItems: 'center',
  },
  planName: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  priceText: {
    fontSize: 20,
    color: '#D4AF37',
    fontFamily: 'Inter-Medium',
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
});

export default BuyLeavesPage;