import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lastFetchedListing, setLastFetchedlisting] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingsRef = collection(db, "listings");

        // get query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(2)
        );

        // execute query
        const querySnap = await getDocs(q);

        const lastVisisble = querySnap.docs[querySnap.docs.length - 1];

        setLastFetchedlisting(lastVisisble);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("could not fetch listings");
      }
    };
    fetchListings();
  }, [params.categoryName]);

  // pagination/ more loading
  const onFetchMoreListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, "listings");

      // get query
      const q = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // execute query
      const querySnap = await getDocs(q);

      const lastVisisble = querySnap.docs[querySnap.docs.length - 1];

      setLastFetchedlisting(lastVisisble);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("could not fetch listings");
    }
  };
 

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Place is for rent"
            : "Place is for sale"}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p> No Listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
