import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import {
  Plane,
  Train,
  Bus,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CityEvent {
  id: string;
  title: string;
  type: "flight" | "train" | "bus" | "event";
  time: string;
  location: string;
  details: string;
  passengers?: number;
  terminal?: string;
}

interface HourlyCount {
  hour: string;
  count: number;
  locations: string[];
  totalPassengers: number;
}

const CityInfo = () => {
  const [searchCity, setSearchCity] = useState("Birmingham");
  const [activeTab, setActiveTab] = useState("flights");
  const [loading, setLoading] = useState(false);
  const [arrivals, setArrivals] = useState([]);
  const [flightData, setFlightData] = useState([]);

  const [transportData, setTransportData] = useState<
    Record<string, CityEvent[]>
  >({
    flights: [],
    trains: [],
    buses: [],
    events: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchArrivals = async () => {
      const headers = {
        "X-RapidAPI-Key": "8301f8c387msh12139157bfaee9bp116ab6jsn0633ba721fa9",
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
      };

      const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/BHX/2025-08-01T10:00/2025-08-01T22:00?withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`;

      try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        const filtered = data.arrivals.filter((arrival) => {
          return (
            arrival.codeshareStatus === "IsOperator" &&
            arrival.isCargo === false
          );
        });
        console.log(filtered);
        setArrivals(filtered); // ✅ This is what was missing
      } catch (err) {
        // setError(err.message);
        console.error("Failed to fetch arrivals:", err);
      }
    };

    fetchArrivals();
  }, []);

  useEffect(() => {
    const counts: Record<number, number> = {};

    arrivals.forEach((flight) => {
      const utc = flight?.arrival?.scheduledTime?.local;

      if (!utc) return;
      // Convert to Date and get hour
      const date = new Date(utc.replace(" ", "T")); // Fix for "2025-08-09 09:35Z"
      const hour = date.getUTCHours();

      counts[hour] = (counts[hour] || 0) + 1;
    });

    const result = Object.entries(counts)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([hour, count]) => ({
        hour: `${hour.padStart(2, "0")}:00 - ${(Number(hour) + 1)
          .toString()
          .padStart(2, "0")}:00`,
        count,
        locations: ["BHX"],
        totalPassengers: "0",
      }));

    setFlightData(result);
    console.log(result);
  }, [arrivals]);

  // console.log("groupFlightsByHour", groupFlightsByHour(arrivals));

  // UK cities with their transport hubs
  const cityConfig = {
    Birmingham: {
      iata: "BHX",
      railHub: "Birmingham New Street",
      coachStation: "Birmingham Coach Station",
      airportName: "Birmingham Airport",
    },
    Manchester: {
      iata: "MAN",
      railHub: "Manchester Piccadilly",
      coachStation: "Manchester Coach Station",
      airportName: "Manchester Airport",
    },
    Liverpool: {
      iata: "LPL",
      railHub: "Liverpool Lime Street",
      coachStation: "Liverpool One Bus Station",
      airportName: "Liverpool John Lennon Airport",
    },
  };

  const cities = Object.keys(cityConfig);

  // Fetch real transport data via Supabase edge functions
  const fetchTransportData = async (city: string) => {
    setLoading(true);
    console.log(`Fetching real transport data for ${city} via Supabase...`);

    try {
      const config = cityConfig[city as keyof typeof cityConfig];
      if (!config) {
        throw new Error(`Configuration not found for ${city}`);
      }

      const today = new Date().toISOString().split("T")[0];
      const currentTime = new Date()
        .toLocaleTimeString("en-GB", { hour12: false })
        .substring(0, 5);

      // Fetch flight data via Supabase edge function
      let flightData = { flights: [] };
      try {
        console.log(`Fetching flights for ${config.iata}...`);
        const flightResponse = await fetch("/api/v1/rest/rpc/invoke", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function_name: "get-flight-data",
            args: {
              iataCode: config.iata,
              date: today,
            },
          }),
        });

        if (flightResponse.ok) {
          const data = await flightResponse.json();
          flightData = data;
          console.log(`Found ${flightData.flights.length} flights`);
        } else {
          console.error(`Flight API error: ${flightResponse.status}`);
        }
      } catch (error) {
        console.error("Flight API error:", error);
      }

      // Fetch train data via Supabase edge function
      let trainData = { trains: [] };
      try {
        console.log(`Fetching trains from ${config.railHub}...`);
        const trainResponse = await fetch("/api/v1/rest/rpc/invoke", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function_name: "get-transport-data",
            args: {
              from: config.railHub,
              to: "London",
              type: "train",
              date: today,
              time: currentTime,
            },
          }),
        });

        if (trainResponse.ok) {
          const data = await trainResponse.json();
          trainData = data;
          console.log(`Found ${trainData.trains.length} trains`);
        } else {
          console.error(`Train API error: ${trainResponse.status}`);
        }
      } catch (error) {
        console.error("Train API error:", error);
      }

      // Fetch bus data via Supabase edge function
      let busData = { buses: [] };
      try {
        console.log(`Fetching buses from ${config.coachStation}...`);
        const busResponse = await fetch("/api/v1/rest/rpc/invoke", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function_name: "get-transport-data",
            args: {
              from: config.coachStation,
              to: "London Victoria Coach Station",
              type: "bus",
              date: today,
              time: currentTime,
            },
          }),
        });

        if (busResponse.ok) {
          const data = await busResponse.json();
          busData = data;
          console.log(`Found ${busData.buses.length} buses`);
        } else {
          console.error(`Bus API error: ${busResponse.status}`);
        }
      } catch (error) {
        console.error("Bus API error:", error);
      }

      // Events data
      const eventsData = {
        events: [
          {
            id: "event-1",
            title:
              city === "Birmingham"
                ? "Birmingham Symphony Hall Concert"
                : city === "Manchester"
                ? "Manchester Arena Event"
                : "Liverpool Philharmonic Concert",
            type: "event" as const,
            time: "19:30",
            location:
              city === "Birmingham"
                ? "Symphony Hall Birmingham"
                : city === "Manchester"
                ? "AO Arena Manchester"
                : "Liverpool Philharmonic Hall",
            details: "Evening performance - expect high footfall",
            passengers: city === "Manchester" ? 21000 : 2000,
          },
          {
            id: "event-2",
            title: `${city} Business Conference`,
            type: "event" as const,
            time: "09:00",
            location: `${city} International Convention Centre`,
            details: "Major business networking event",
            passengers: 1500,
          },
        ],
      };

      setTransportData({
        flights: flightData.flights || [],
        trains: trainData.trains || [],
        buses: busData.buses || [],
        events: eventsData.events || [],
      });

      const hasRealData =
        flightData.flights.length > 0 ||
        trainData.trains.length > 0 ||
        busData.buses.length > 0;

      toast({
        title: hasRealData
          ? "Live transport data loaded"
          : "No live data available",
        description: hasRealData
          ? `Real API data for ${city}`
          : `No live transport data found for ${city}`,
        variant: hasRealData ? "default" : "destructive",
      });

      console.log("Final transport data:", {
        flights: flightData.flights?.length || 0,
        trains: trainData.trains?.length || 0,
        buses: busData.buses?.length || 0,
        events: eventsData.events?.length || 0,
        usingRealData: hasRealData,
      });
    } catch (error) {
      console.error("Error fetching transport data:", error);

      setTransportData({
        flights: [],
        trains: [],
        buses: [],
        events: [],
      });

      toast({
        title: "Failed to load live data",
        description: "Unable to fetch live transport data from APIs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  // Fetch data when city changes
  useEffect(() => {
    fetchTransportData(searchCity);
  }, [searchCity]);

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="w-4 h-4" />;
      case "train":
        return <Train className="w-4 h-4" />;
      case "bus":
        return <Bus className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "train":
        return "bg-green-100 text-green-800";
      case "bus":
        return "bg-yellow-100 text-yellow-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  // Function to group transport data by hour
  // const groupByHour = (data: CityEvent[]): HourlyCount[] => {
  //   const hourlyMap = new Map<string, HourlyCount>();

  //   data.forEach((item) => {
  //     const hour = item.time.split(":")[0]; // Extract hour from time (e.g., "14" from "14:30")
  //     const hourRange = `${hour}:00 - ${hour}:59`;

  //     if (!hourlyMap.has(hourRange)) {
  //       hourlyMap.set(hourRange, {
  //         hourLabel: hourRange,
  //         count: 0,
  //         locations: [],
  //         totalPassengers: 0,
  //       });
  //     }

  //     const existing = hourlyMap.get(hourRange)!;
  //     existing.count += 1;
  //     existing.totalPassengers += item.passengers || 0;

  //     // Add unique locations
  //     const locationShort = item.location.split(" ")[0]; // Get first word of location
  //     if (!existing.locations.includes(locationShort)) {
  //       existing.locations.push(locationShort);
  //     }
  //   });

  //   return Array.from(hourlyMap.values()).sort((a, b) =>
  //     a.hourLabel.localeCompare(b.hourLabel)
  //   );
  // };

  const tabData = [
    {
      id: "flights",
      label: "Flights",
      icon: Plane,
      data: flightData,
      isTransport: true,
    },
    {
      id: "trains",
      label: "Trains",
      icon: Train,
      data: transportData.trains,
      isTransport: true,
    },
    {
      id: "buses",
      label: "Buses",
      icon: Bus,
      data: transportData.buses,
      isTransport: true,
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      data: transportData.events,
      isTransport: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-white/90">
              Select City
            </label>
            <Select value={searchCity} onValueChange={setSearchCity}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 sm:h-10">
                <SelectValue placeholder="Choose your city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current City */}
          <GradientCard
            variant="card"
            className="bg-white/10 backdrop-blur-sm border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Current Location</p>
                <p className="text-xl font-bold text-white">{searchCity}</p>
              </div>
              <MapPin className="w-6 h-6 text-white/60" />
            </div>
          </GradientCard>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading transport data...
            </span>
          </div>
        )}

        {/* Modern Tab Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 touch-manipulation
                ${
                  activeTab === tab.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
                }
              `}
            >
              {activeTab === tab.id && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" />
              )}
              <div
                className={`
                w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/20"
                }
              `}
              >
                <tab.icon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span
                className={`
                text-xs sm:text-sm font-medium transition-colors duration-300 text-center
                ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              `}
              >
                {tab.label}
              </span>
              <div
                className={`
                w-6 h-0.5 sm:w-8 sm:h-1 rounded-full transition-all duration-300
                ${activeTab === tab.id ? "bg-primary" : "bg-transparent"}
              `}
              />
            </button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {tabData.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              {tab.data.length === 0 ? (
                <GradientCard className="text-center py-8">
                  <tab.icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-primary">
                    No {tab.label.toLowerCase()} found
                  </h3>
                  <p className="text-muted-foreground">
                    No {tab.label.toLowerCase()} scheduled for {searchCity}{" "}
                    today
                  </p>
                </GradientCard>
              ) : (
                <div className="space-y-3">
                  {tab.isTransport
                    ? // Hourly grouped view for transport
                      tab.data.map((hourlyData, index) => (
                        <GradientCard
                          key={index}
                          className="hover:shadow-soft transition-shadow"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    className={getTypeColor(tab.data[0].type)}
                                  >
                                    {getIcon(tab.data[0].type)}
                                    <span className="ml-1 capitalize">
                                      {tab.label}
                                    </span>
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {hourlyData.count}{" "}
                                    {hourlyData.count === 1
                                      ? "arrival"
                                      : "arrivals"}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg">
                                  {hourlyData.hour}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {hourlyData.count} {tab.label.toLowerCase()}{" "}
                                  arriving this hour
                                </p>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-medium mb-1">
                                  <Clock className="w-4 h-4" />
                                  {hourlyData.hourLabel}
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                  {hourlyData.count}
                                </p>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {hourlyData.locations.length === 1
                                    ? hourlyData.locations[0]
                                    : `${hourlyData.locations.length} locations`}
                                </span>
                              </div>
                              {hourlyData.locations.length > 1 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hourlyData.locations.map((location, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {location}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </GradientCard>
                      ))
                    : // Individual view for events
                      tab.data.map((item) => (
                        <GradientCard
                          key={item.id}
                          className="hover:shadow-soft transition-shadow"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getTypeColor(item.type)}>
                                    {getIcon(item.type)}
                                    <span className="ml-1 capitalize">
                                      {item.type}
                                    </span>
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.details}
                                </p>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-medium">
                                  <Clock className="w-4 h-4" />
                                  {formatTime(item.time)}
                                </div>
                              </div>
                            </div>

                            {/* Location and Details */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>
                        </GradientCard>
                      ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default CityInfo;
