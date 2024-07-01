/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import Index from '../components/Index.vue';
import Signin from '../components/Signin.vue';
import UserForm from '../components/UserForm.vue';
import Dashboard from '../components/Dashboard.vue';
import Project from '../components/Project.vue';
import Dataset from '../components/Dataset.vue';
import ComputeResource from '../components/ComputeResource.vue';
import TenantMembers from '../components/TenantMembers.vue';
import Deactivate from '../components/Deactivate.vue';
import JobHistory from '../components/JobHistory.vue';
import SampleProject from '../components/SampleProject.vue';
import Pipeline from '../components/Pipeline.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

const router = new VueRouter({
  routes: [
    {
      path: '/signin', component: Signin
    }, {
      path: '/form', component: UserForm
    }, {
      path: '/dashboard', component: Index,
      children: [
        {
          component: Dashboard,
          name: 'Dashboard',
          path: '/dashboard'
        }
      ]
    }, {
      path: '/project', component: Index,
      children: [
        {
          component: Project,
          name: 'Project',
          path: '/project'
        }
      ]
    }, {
      path: '/dataset', component: Index,
      children: [
        {
          component: Dataset,
          name: 'Dataset',
          path: '/dataset'
        }
      ]
    }, {
      path: '/computeResource', component: Index,
      children: [
        {
          component: ComputeResource,
          name: 'ComputeResource',
          path: '/computeResource'
        }
      ]
    }, {
      path: '/jobhistory', component: Index,
      children: [
        {
          component: JobHistory,
          name: 'JobHistory',
          path: '/jobhistory'
        }
      ]
    }, {
      path: '/sampleProject', component: Index,
      children: [
        {
          component: SampleProject,
          name: 'SampleProject',
          path: '/sampleProject'
        }
      ]
    }, {
      path: '/pipeline', component: Index,
      children: [
        {
          component: Pipeline,
          name: 'Pipeline',
          path: '/pipeline'
        }
      ]
    }, {
      path: '/deactivate', component: Index,
      children: [
        {
          component: Deactivate,
          name: 'Deactivate',
          path: '/deactivate'
        }
      ]
    }, {
      path: '*',
      redirect: '/dashboard'
    }
  ]
});

export default router;
