/*
  Copyright 2020-2021 Lowdefy, Inc

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

import generateImportFile from './generateImportFile.js';

async function writeOperatorImports({ components, context }) {
  await context.writeBuildArtifact(
    'plugins/operatorsClient.js',
    generateImportFile({
      types: components.types.operators.client,
      importPath: 'operators/client',
    })
  );
  await context.writeBuildArtifact(
    'plugins/operatorsServer.js',
    generateImportFile({
      types: components.types.operators.server,
      importPath: 'operators/server',
    })
  );
}

export default writeOperatorImports;
