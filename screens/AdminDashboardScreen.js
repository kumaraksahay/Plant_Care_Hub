import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function AdminDashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, styles.cardLeft]}
          onPress={() => navigation.navigate("ManageProductsScreen")}
        >
          <Image
            source={require("./assets/products-icon.png")} // Add your products icon
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Manage Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardRight]}
          onPress={() => navigation.navigate("ManageOrdersScreen")}
        >
          <Image
            source={require("./assets/orders-icon.png")} // Add your orders icon
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Manage Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, styles.cardLeft]}
          onPress={() => navigation.navigate("AnalyticsScreen")}
        >
          <Image
            source={require("./assets/analytics-icon.png")} // Add analytics icon if needed
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardRight]}
          onPress={() => navigation.navigate("ManageUsersScreen")}
        >
          <Image
            source={require("./assets/users-icon.png")} // Add users icon if needed
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Manage Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fa",
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e3d58",
    marginVertical: 30,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    width: "48%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 15,
  },
  cardLeft: {
    marginLeft: 5,
  },
  cardRight: {
    marginRight: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3d58",
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
