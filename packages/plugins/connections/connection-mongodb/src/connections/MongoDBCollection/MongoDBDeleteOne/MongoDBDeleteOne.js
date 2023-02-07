/*
  Copyright 2020-2023 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import getCollection from '../getCollection.js';
import { serialize, deserialize } from '../serialize.js';
import schema from './schema.js';

async function MongodbDeleteOne({ blockId, connection, pageId, request, requestId, payload }) {
  const deserializedRequest = deserialize(request);
  const { filter, options } = deserializedRequest;
  const { collection, client, logCollection } = await getCollection({ connection });
  let response;
  try {
    if (logCollection) {
      response = await collection.findOneAndDelete(filter, options);
      await logCollection.insertOne({
        args: { filter, options },
        blockId,
        pageId,
        payload,
        requestId,
        before: response,
        timestamp: new Date(),
        type: 'MongoDBDeleteOne',
        user: connection.changeLog?.user,
      });
    } else {
      response = await collection.deleteOne(filter, options);
    }
  } catch (error) {
    await client.close();
    throw error;
  }
  await client.close();
  const { acknowledged, deletedCount } = serialize(response);
  return { acknowledged, deletedCount };
}

MongodbDeleteOne.schema = schema;
MongodbDeleteOne.meta = {
  checkRead: false,
  checkWrite: true,
};

export default MongodbDeleteOne;
