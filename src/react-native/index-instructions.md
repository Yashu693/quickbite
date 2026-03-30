# FEATURE 6 — Firestore Index Instructions

To successfully run the `collectionGroup(db, "orders")` query ordered by timestamp without encountering Firebase "Index Missing" errors, you must set up an index with the **Collection group** scope.

### How to Create It Manually in the Firebase Console:
1. Open your [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Firestore Database** > **Indexes** tab.
3. Choose the **Single Field** configuration (or **Composite** depending on exact console layout for Collection Groups) and click **Add Index**.
4. Fill out the fields exactly as follows:
   - **Collection ID**: `orders`
   - **Fields to index**: `timestamp`
   - **Order**: `Descending`
   - **Query scopes**: Switch from *Collection* to **Collection group**
5. Click **Create** and wait a few minutes for the status to change to *Enabled*.

### Alternative: Using the Firebase CLI
If you deploy your indexes via `firebase.json` using the Firebase CLI, add this to your `firestore.indexes.json`:

```json
{
  "fieldOverrides": [
    {
      "collectionGroup": "orders",
      "fieldPath": "timestamp",
      "indexes": [
        {
          "order": "DESCENDING",
          "queryScope": "COLLECTION_GROUP"
        }
      ]
    }
  ]
}
```
Run `firebase deploy --only firestore:indexes` to deploy it automatically to your project!
