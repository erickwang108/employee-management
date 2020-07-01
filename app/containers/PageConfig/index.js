import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  Divider,
  Form,
  Input,
} from 'antd';

import { createDb } from 'helpers/dbUtils';
import Loader from 'components/Loader';
import { appStores } from 'stores';
import {
  Container,
  ButtonContainer,
} from './styles';

const { app, dialog } = require('electron').remote;

function appState() {
  const {
    configStore,
  } = appStores();

  return useObserver(() => ({
    errors: configStore.errors,
    initConfig: configStore.initConfig,
    configData: configStore.configData,
    onUpdateData: configStore.onUpdateData,
    onSaveConfig: configStore.onSaveConfig,
  }));
}

export default function PageConfig() {
  const {
    errors,
    initConfig,
    configData,
    onUpdateData,
    onSaveConfig,
  } = appState();
  const history = useHistory();

  useEffect(() => {
    initConfig();
  }, []);

  if (!configData) {
    return (<Loader />);
  }

  async function onSelectDB() {
    if (configData.dbPath === '') {
      const filePath = dialog.showSaveDialogSync(null, {
        title: '数据库位置',
        defaultPath: `${app.getPath('documents')}/employee-database.sqlite`,
        properties: ['openFile'],
      });

      if (filePath) {
        await createDb(filePath);

        onUpdateData('dbPath', filePath);
      }
    } else {
      const filePaths = dialog.showOpenDialogSync(null, {
        title: '数据库文件路径',
        filters: [
          { name: 'sqlite3', extensions: ['sqlite'] },
          { name: '所有文件', extensions: ['*'] },
        ],
        properties: ['openFile'],
      });

      if (filePaths && filePaths.length > 0) {
        onUpdateData('dbPath', filePaths[0]);
      }
    }
  }

  return (
    <Container>
      <Divider orientation="left">用户配置</Divider>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item label="数据库位置">
          <Input
            value={configData.dbPath}
            onChange={(e) => { onUpdateData('dbPath', e.target.value); }}
            addonAfter={(
              <Button
                size="small"
                type="link"
                onClick={onSelectDB}
              >
                选择
              </Button>
            )}
            defaultValue="mysite"
          />
        </Form.Item>
      </Form>
      <ButtonContainer>
        <Button
          type="primary"
          disabled={errors.length > 0}
          onClick={async () => {
            await onSaveConfig();
            history.push('/company');
          }}
        >
          保存
        </Button>
        <Button
          style={{
            margin: '0 8px',
          }}
          onClick={() => {
            history.push('/company');
          }}
        >
          取消
        </Button>
      </ButtonContainer>
    </Container>
  );
}
