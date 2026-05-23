// App.js — Travel Buddy (FINAL COMPLETE)
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// ======= NAVIGATORS =======
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStack = createNativeStackNavigator();

// ======= DATA =======
const destinations = [
  { id: '1', name: 'Bali', location: 'Indonesia', description: 'Pulau dewata dengan pantai eksotis dan budaya Hindu yang kaya.', rating: 4.8, price: 'Rp 2.200.000', category: 'Pantai' },
  { id: '2', name: 'Jakarta', location: 'Indonesia', description: 'Ibu kota dengan kehidupan malam seru dan kuliner beragam.', rating: 3.9, price: 'Rp 800.000', category: 'Kota' },
  { id: '3', name: 'Yogyakarta', location: 'Indonesia', description: 'Kota budaya dengan sejarah panjang, Borobudur, dan Prambanan.', rating: 4.7, price: 'Rp 1.200.000', category: 'Budaya' },
  { id: '4', name: 'Raja Ampat', location: 'Papua Barat', description: 'Surga bawah laut dengan keanekaragaman hayati laut tertinggi di dunia.', rating: 4.9, price: 'Rp 3.500.000', category: 'Bahari' },
  { id: '5', name: 'Labuan Bajo', location: 'NTT', description: 'Pintu gerbang Taman Nasional Komodo, sunset terbaik di Indonesia.', rating: 4.8, price: 'Rp 2.800.000', category: 'Petualangan' },
  { id: '6', name: 'Danau Toba', location: 'Sumatera Utara', description: 'Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya.', rating: 4.7, price: 'Rp 1.500.000', category: 'Danau' },
  { id: '7', name: 'Lombok', location: 'NTB', description: 'Pantai bersih, Gunung Rinjani, dan Gili Islands yang menawan.', rating: 4.6, price: 'Rp 1.800.000', category: 'Pantai' },
  { id: '8', name: 'Bromo', location: 'Jawa Timur', description: 'Gunung berapi aktif dengan sunrise dan lautan pasir yang dramatis.', rating: 4.7, price: 'Rp 900.000', category: 'Gunung' },
  { id: '9', name: 'Belitung', location: 'Bangka Belitung', description: 'Pantai berbatu granit unik dengan air laut biru kehijauan jernih.', rating: 4.6, price: 'Rp 1.600.000', category: 'Pantai' },
  { id: '10', name: 'Wakatobi', location: 'Sulawesi Tenggara', description: 'Spot diving kelas dunia dengan visibilitas hingga 40 meter.', rating: 4.9, price: 'Rp 3.200.000', category: 'Bahari' },
];

// ======= FAVORITES STATE (sederhana pakai module-level array) =======
// Pakai React Context agar bisa share antar screen
const FavoritesContext = React.createContext();

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = React.useState([]);

  const addFavorite = (dest) => {
    setFavorites((prev) => {
      if (prev.find((d) => d.id === dest.id)) return prev;
      return [...prev, dest];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((d) => d.id !== id));
  };

  const isFavorite = (id) => favorites.some((d) => d.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ======= SCREENS =======

// --- HomeScreen ---
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.homeHeader}>
            <Text style={styles.greeting}>Halo, Traveler! 👋</Text>
            <Text style={styles.homeTitle}>Popular Destinations</Text>
            <Text style={styles.homeSubtitle}>{destinations.length} destinasi menakjubkan</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { destination: item })}
            activeOpacity={0.85}
          >
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>{item.category}</Text>
            </View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.cardRating}>⭐ {item.rating}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// --- DetailScreen ---
function DetailScreen({ route }) {
  const { destination } = route.params;
  const { addFavorite, removeFavorite, isFavorite } = React.useContext(FavoritesContext);
  const favorite = isFavorite(destination.id);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(destination.id);
      Alert.alert('Dihapus', `${destination.name} dihapus dari favorit.`);
    } else {
      addFavorite(destination);
      Alert.alert('Ditambahkan! ❤️', `${destination.name} disimpan ke favorit.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Category Badge */}
        <View style={[styles.cardBadge, { alignSelf: 'flex-start', marginBottom: 12 }]}>
          <Text style={styles.cardBadgeText}>{destination.category}</Text>
        </View>

        {/* Name */}
        <Text style={styles.detailName}>📍 {destination.name}</Text>
        <Text style={styles.detailLocation}>{destination.location}</Text>

        {/* Description */}
        <View style={styles.detailBox}>
          <Text style={styles.detailSectionTitle}>Tentang Destinasi</Text>
          <Text style={styles.detailDesc}>{destination.description}</Text>
        </View>

        {/* Price & Rating */}
        <View style={styles.detailRow}>
          <View style={[styles.detailBox, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.detailLabel}>Rating</Text>
            <Text style={styles.detailRating}>⭐ {destination.rating}</Text>
          </View>
          <View style={[styles.detailBox, { flex: 1 }]}>
            <Text style={styles.detailLabel}>Harga Mulai</Text>
            <Text style={styles.detailPrice}>{destination.price}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.detailBox}>
          <Text style={styles.detailSectionTitle}>Info Perjalanan</Text>
          <Text style={styles.detailInfoItem}>🕐 Durasi: 3–5 Hari</Text>
          <Text style={styles.detailInfoItem}>👥 Grup: 2–10 Orang</Text>
          <Text style={styles.detailInfoItem}>🌤️ Cuaca: Tropis</Text>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={[styles.favBtn, favorite && styles.favBtnActive]}
          onPress={handleToggleFavorite}
          activeOpacity={0.85}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={20}
            color="#fff"
          />
          <Text style={styles.favBtnText}>
            {favorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          </Text>
        </TouchableOpacity>

        {/* Book Button */}
        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
          <Text style={styles.bookBtnText}>Pesan Sekarang</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SearchScreen ---
function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [searched, setSearched] = React.useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setSearched(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={styles.screenTitle}>🔍 Cari Destinasi</Text>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            placeholder="Cari nama, lokasi, atau kategori..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setSearched(false); setResults([]); }}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>

        {/* Results */}
        {searched && (
          <Text style={styles.resultCount}>
            {results.length} hasil untuk "{searchQuery}"
          </Text>
        )}

        <FlatList
          data={searched ? results : destinations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SearchDetail', { destination: item })}
              activeOpacity={0.85}
            >
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.category}</Text>
              </View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardLocation}>📍 {item.location}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardRating}>⭐ {item.rating}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>😔</Text>
                <Text style={styles.emptyText}>Destinasi tidak ditemukan</Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

// --- FavoritesScreen ---
function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = React.useContext(FavoritesContext);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ paddingTop: 8, paddingBottom: 8 }}>
            <Text style={styles.screenTitle}>❤️ Favorit Saya</Text>
            {favorites.length > 0 && (
              <Text style={styles.homeSubtitle}>{favorites.length} destinasi tersimpan</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('FavDetail', { destination: item })}
              activeOpacity={0.85}
            >
              <Text style={styles.cardName}>❤️ {item.name}</Text>
              <Text style={styles.cardLocation}>📍 {item.location}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardRating}>⭐ {item.rating}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFavorite(item.id)}
            >
              <Ionicons name="trash-outline" size={13} color="#d63031" />
              <Text style={styles.removeBtnText}>Hapus dari favorit</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyText}>Belum ada favorit</Text>
            <Text style={styles.emptySubtext}>
              Tap tombol ❤️ di halaman detail untuk menyimpan destinasi
            </Text>
          </View>
        }
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ======= STACK NAVIGATORS =======

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#00b894' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '🏠 Destinations' }} />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.destination?.name || 'Detail' })}
      />
    </Stack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#00b894' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <SearchStack.Screen name="Search" component={SearchScreen} options={{ title: '🔍 Search' }} />
      <SearchStack.Screen
        name="SearchDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.destination?.name || 'Detail' })}
      />
    </SearchStack.Navigator>
  );
}

const FavStack = createNativeStackNavigator();
function FavStackNavigator() {
  return (
    <FavStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#00b894' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <FavStack.Screen name="Favorites" component={FavoritesScreen} options={{ title: '❤️ Favorit' }} />
      <FavStack.Screen
        name="FavDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.destination?.name || 'Detail' })}
      />
    </FavStack.Navigator>
  );
}

// ======= TAB NAVIGATOR =======
function TabNavigator() {
  const { favorites } = React.useContext(FavoritesContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = 'home';
          if (route.name === 'SearchTab') iconName = 'search';
          if (route.name === 'FavoritesTab') iconName = 'heart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00b894',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#f5f5f5', paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchStackNavigator} options={{ title: 'Search' }} />
      <Tab.Screen
        name="FavoritesTab"
        component={FavStackNavigator}
        options={{
          title: 'Favorit',
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: { backgroundColor: '#d63031', fontSize: 10 },
        }}
      />
    </Tab.Navigator>
  );
}

// ======= APP ENTRY =======
export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </FavoritesProvider>
  );
}

// ======= STYLES =======
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },

  // Home
  homeHeader: { paddingTop: 8, paddingBottom: 16 },
  greeting: { fontSize: 14, color: '#636e72' },
  homeTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', letterSpacing: -0.5 },
  homeSubtitle: { fontSize: 13, color: '#636e72', marginTop: 4 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardBadge: {
    backgroundColor: '#00b894',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  cardBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardName: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 3 },
  cardLocation: { fontSize: 12, color: '#636e72', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#636e72', lineHeight: 18, marginBottom: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardRating: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  cardPrice: { fontSize: 13, fontWeight: '700', color: '#00b894' },

  // Detail
  detailName: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginBottom: 4 },
  detailLocation: { fontSize: 14, color: '#636e72', marginBottom: 16 },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  detailSectionTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  detailDesc: { fontSize: 14, color: '#636e72', lineHeight: 22 },
  detailRow: { flexDirection: 'row', marginBottom: 0 },
  detailLabel: { fontSize: 11, color: '#636e72', marginBottom: 4 },
  detailRating: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  detailPrice: { fontSize: 14, fontWeight: '700', color: '#00b894' },
  detailInfoItem: { fontSize: 14, color: '#636e72', marginBottom: 6 },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#636e72',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 8,
  },
  favBtnActive: { backgroundColor: '#d63031' },
  favBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b894',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    gap: 8,
  },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Search
  screenTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginBottom: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  searchBtn: {
    backgroundColor: '#00b894',
    borderRadius: 12,
    padding: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultCount: { fontSize: 13, color: '#636e72', marginBottom: 10 },

  // Favorites
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 10,
  },
  removeBtnText: { fontSize: 12, color: '#d63031', fontWeight: '600' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  emptySubtext: { fontSize: 13, color: '#636e72', textAlign: 'center', lineHeight: 20 },
});