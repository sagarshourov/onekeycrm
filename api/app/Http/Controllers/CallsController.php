<?php

namespace App\Http\Controllers;

use App\Models\Calls;
use App\Models\CallsExtra;
use App\Models\ExtraGroups;
use App\Models\ExtraValues;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CallImport;
use App\Imports\SingleSheetImport;

use Illuminate\Support\Facades\DB;
use App\Models\AssignEmployee;
use App\Models\Package;
use App\Models\Sections;
use App\Models\Status;
use App\Models\Notifications;
use App\Models\CallHistory;


use Illuminate\Support\Facades\Http;

class CallsController extends BaseController
{


    private function clean($string)
    {

        $a =  explode('-', $string);

        if (isset($a[0])) {
            $strig = str_replace(' ', '-', $a[0]); // Replaces all spaces with hyphens.

            return preg_replace('/[^A-Za-z0-9\-]/', '', $strig); // Removes special chars.


        } else {

            return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars. 
        }
    }

    private function create_call_extra($filed, $value, $user_id, $call_id)
    {
        $input['call_id'] = (int) $call_id;
        $input['field'] = $filed;
        $input['value'] =  $value;
        $input['user_id'] = (int) $user_id;
        CallsExtra::create($input);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    private function get_calls($off = 200)
    {

        $user = Auth::user();

        //   return   $user;

        if ($user->is_admin == 3) {
            return Calls::where('assigned_to', $user->id)->WhereIn('results', [1, 2, 3, 6])->with(['extra.values',  'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user', 'p_sort'])->orderBy('sort', 'ASC')->offset($off)->limit(100)->get();
        } else if ($user->is_admin == 4) {

            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
            $emp[] = $user->id;

            return  Calls::WhereIn('assigned_to', $emp)
                ->where(function ($q) {
                    $q->WhereIn('results', [1, 2, 3, 6]);
                })->with(['extra.values',  'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user', 'p_sort'])->orderBy('sort', 'ASC')->offset($off)->limit(100)->get();


            //  return Calls::WhereIn('assigned_to', $emp)->with(['extra.values',  'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->orderBy('sort', 'ASC')->get();

            // return $emp;
        } else {
            return Calls::WhereIn('results', [2, 3, 6])->with(['extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for',  'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user', 'p_sort'])->orderBy('sort', 'ASC')->offset($off)->limit(100)->get();
        }
    }


    public function call_paginate($off, $order)
    {

        return $this->sendResponse($this->get_calls($off), 'Calls Retrieve successfully.');
    }



    private function get_Cancel_calls()
    {

        $user = Auth::user();

        //   return   $user;

        if ($user->is_admin == 3) {
            return Calls::where(['assigned_to' => $user->id, 'results' => 3])->with(['extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->orderBy('sort', 'DESC')->get();
        } else {
            return Calls::where('results', 3)->with(['extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for',  'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->orderBy('sort', 'DESC')->get();
        }
    }


    public function reports($emp_id, $off)
    {

        $user = Auth::user();

        //   return   $user;
        if ($user->is_admin == 4) {

            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
            $emp[] = $user->id;
            $calls = Calls::WhereIn('assigned_to', $emp)->with(['extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->orderBy('id', 'desc')->offset($off)->limit(20)->get();
        } else if ($user->is_admin == 3) {
            $calls = Calls::where('assigned_to', $user->id)->with(['extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->orderBy('id', 'desc')->offset($off)->limit(20)->get();
        } else {
            $calls = Calls::where('assigned_to', $emp_id)->with(['extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for',  'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->orderBy('id', 'desc')->offset($off)->limit(20)->get();
        }


        return $this->sendResponse($calls, 'Calls Retrieve successfully.');
    }







    private function get_filter_cal($user_id, $field, $value, $off, $limit, $search, $order)
    {


        $user = Auth::user();


        $query = '';
        if ($search == '0') {
            $query = '';
        } else {
            $query = trim($search);
        }

        $with = array('extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for',  'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user');

        $null = $value;
        if ($value == 'null') $null = NULL;




        if ($user->is_admin && $user->is_admin == 4) {
            // return Calls::where(['assigned_to' => $user->id, $field => $value])->with($with)->orderBy('id', 'DESC')->offset($off)->limit($limit)->get();
            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
            $emp[] = $user->id;



            if ($search == '0') {
                return Calls::WhereIn('assigned_to', $emp)->where($field, '=', $null)->with($with)->orderBy('sort', $order)->offset($off)->limit($limit)->get();
            } else if ($field == 'sections' && $search != '0') {
                return Calls::WhereIn('assigned_to', $emp)->where('email', 'like', '%' . $query . '%')->OrWhere('first_name', 'like', '%' . $query . '%')->OrWhere('last_name', 'like', '%' . $query . '%')->with($with)->get();
            } {

                return  Calls::WhereIn('assigned_to', $emp)
                    ->where(function ($q) use ($field, $null, $query) {
                        $q->where([[$field, '=',  $null], ['email', 'like', '%' . $query . '%']])->OrWhere([[$field, '=',  $null], ['first_name', 'like', '%' . $query . '%']]);
                    })
                    ->with($with)
                    ->get();
                //  return Calls::WhereIn('assigned_to', $emp)->where([[$field, '=',  $null], ['email', 'like', '%' . $query . '%'], ['first_name', 'like', '%' . $query . '%']])->with($with)->get();
            }
        }

        // instruction 19/6/2024 jira 20 else if ($user->is_admin && $user->is_admin == 3) {
        //     // return Calls::where(['assigned_to' => $user->id, $field => $value])->with($with)->orderBy('id', 'DESC')->offset($off)->limit($limit)->get();


        //     if ($search == '0') {

        //         // return $field.'='.$null;
        //         //  return Calls::where([$field, '=',  $null], ['assigned_to', '=', $user->id])->get();

        //         return Calls::where([['assigned_to', '=', $user->id], [$field, '=',  $null]])->with($with)->orderBy('sort', $order)->offset($off)->limit($limit)->get();
        //     } else if ($field == 'sections' && $search != '0') {

        //         return Calls::where('assigned_to', '=', $user->id)->OrWhere('email', 'like', '%' . $query . '%')->OrWhere('first_name', 'like', '%' . $query . '%')->OrWhere('last_name', 'like', '%' . $query . '%')->with($with)->get();
        //     } else {
        //         return Calls::where([['assigned_to', '=', $user->id], [$field, '=',  $null], ['email', 'like', '%' . $query . '%']])->OrWhere([['assigned_to', '=', $user->id], [$field, '=',  $null], ['first_name', 'like', '%' . $query . '%']])->with($with)->get();
        //     }
        // } 


        else if ($user_id != 0) {
            if ($search == '0') {
                return Calls::where([['assigned_to', '=', $user_id], [$field, '=',  $null]])->with($with)->orderBy('sort', $order)->offset($off)->limit($limit)->get();
            } else if ($field == 'sections' && $search != '0') {
                return Calls::where('email', 'like', '%' . $query . '%')->OrWhere('first_name', 'like', '%' . $query . '%')->OrWhere('last_name', 'like', '%' . $query . '%')->with($with)->get();
            } else {
                return Calls::where([['assigned_to', '=', $user_id], [$field, '=',  $null], ['email', 'like', '%' . $query . '%']])->with($with)->get();
            }
        } else {

            if ($search == '0') {
                //return 'cacll';
                return Calls::where($field,  $null)->with($with)->orderBy('sort', $order)->offset($off)->limit($limit)->get();
            } else if ($field == 'sections' && $search != '0') {

                return Calls::where('email', 'like', '%' . $query . '%')->OrWhere('whatsapp', 'like', '%' . $query . '%')->OrWhere('phone_number', 'like', '%' . $query . '%')->OrWhere('first_name', 'like', '%' . $query . '%')->OrWhere('last_name', 'like', '%' . $query . '%')->with($with)->get();
            } else {
                return Calls::where([[$field, '=',  $null], ['email', 'like', '%' . $query . '%']])->OrWhere([[$field, '=',  $null], ['first_name', 'like', '%' . $query . '%']])->with($with)->get();
            }
        }
    }



    private function cancel_filter($user_id, $field, $value, $startDate, $endDate, $off, $limit, $search, $order)
    {

        $user = Auth::user();

        $auth_id = $user->id;





        $with = array('extra.values', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for',  'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user');



        $que = Calls::where('results', '=', 1);

        if ($startDate != 'null' || $endDate != 'null') {
            $que = Calls::whereBetween('cancel_date', array($startDate, $endDate));
        }



        if ($user->is_admin && $user->is_admin == 4) { // supervisor
            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
            $emp[] = $user->id;
            $que->WhereIn('assigned_to', $emp);
        } else if ($user->is_admin && $user->is_admin == 3) { //employee

            $que->where('assigned_to', '=', $auth_id);
        } else if ($user_id != 0) {
            $que->where('assigned_to', '=', $user_id);
        }
        if ($search != '0') { // search value
            $query = trim($search);
            $que->where(function ($q) use ($query) {
                $q->where('email', 'like', '%' . $query . '%')
                    ->OrWhere('first_name', 'like', '%' . $query . '%')
                    ->OrWhere('last_name', 'like', '%' . $query . '%');
            });
        }


        return    $que->with($with)->orderBy('sort', $order)->offset($off)->limit($limit)->get();
    }




    public function filter($user_id, $field, $value, $startDate, $endDate, $off, $limit, $search, $order)
    {
        if ($value == 1) {
            $filter = $this->cancel_filter($user_id, $field, $value, $startDate, $endDate, $off, $limit, $search, $order);
        } else {
            $filter = $this->get_filter_cal($user_id, $field, $value, $off, $limit, $search, $order);
        }



        return $this->sendResponse($filter, 'Retrieve calls.');
    }



    public function emp_follow_filter($startDate, $endDate, $result, $off, $limit,  $order)
    {
        $user = Auth::user();

        $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
        $emp[] = $user->id;

        $calls = Calls::offset($off)->limit($limit);

        if ($user->is_admin == 4) {

            $calls->WhereIn('assigned_to', $emp);
        } else {
            $calls->where('assigned_to', $user->id);
        }


        if ((int)$result > 0) {
            $calls->where('f_results', $result)->whereBetween('follow_up_date', array($startDate, $endDate));
        }

        return $this->sendResponse($calls->get(), 'Retrieve calls.');
    }



    public function emp_fc_filter($startDate, $endDate, $result, $off, $limit,  $order)
    {
        $user = Auth::user();



        // $calls = Calls::where('assigned_to', $user->id)->offset($off)->limit($limit);


        $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
        $emp[] = $user->id;

        $calls = Calls::offset($off)->limit($limit);

        if ($user->is_admin == 4) {

            $calls->WhereIn('assigned_to', $emp);
        } else {
            $calls->where('assigned_to', $user->id);
        }



        if ((int)$result > 0) {
            $calls->where('f_results', $result)->whereBetween('first_contact', array($startDate, $endDate));
        }

        return $this->sendResponse($calls->get(), 'Retrieve calls.');
    }



    public function emp_filter($startDate, $endDate,  $type, $result, $cancel, $off, $limit,  $order)
    {
        $user = Auth::user();

        $calls = Calls::where('assigned_to',   $user->id)
            ->offset($off)->limit($limit);
        if ($type == 10) {
            $calls->where('ag', 1)->whereBetween('agree_date_sent', [$startDate, $endDate]);
        } else if ($type == 11) {
            $calls->where('agreed_to_signed', 1);
        } else if ((int)$type != 0) {
            $calls->where('status',  $type);
        }


        if ((int) $result == 1) {
            if ($startDate == '2022-01-01' && $endDate == '2028-01-01') {
                $calls->where('results', 1);
            } else {
                $calls->where('results', 1)->whereBetween('cancel_date', [$startDate, $endDate]);
            }

            //$calls->where('results', 1);
        } else if ((int) $result != 0) {
            $calls->where('results',  (int) $result);
        }


        if ((int) $cancel != 0) {
            $calls->where('cancel_reason',  (int) $cancel);
        }


        //  return 'sa';

        return $this->sendResponse($calls->get(), 'Retrieve calls.');
    }



    public function pre_filter($startDate, $endDate, $users, $type,  $off, $limit,  $order)
    {

        if ($type == 10) {
            // $calls = Calls::WhereIn('assigned_to', explode(',', $users))
            //     ->where('ag', 1)
            //     ->whereBetween('agree_date_sent', array($startDate, $endDate))
            //     ->offset($off)->limit($limit)
            //     ->get();
            $usersArray = explode(',', $users);

            $calls =  DB::table('calls')
                ->whereIn('assigned_to', $usersArray)
                ->where('ag', 1)
                ->whereBetween('agree_date_sent', [$startDate, $endDate])
                ->offset($off)
                ->limit($limit)
                ->get();
        } else if ($type == 11) {
            $usersArray = explode(',', $users);
            $calls = Calls::whereIn('assigned_to', $usersArray)
                ->where('agreed_to_signed', 1)
                ->whereBetween('agreement_signed_date', [$startDate, $endDate])
                ->offset($off)->limit($limit)
                ->get();
        } else if ($type == 12) {
            $usersArray = explode(',', $users);
            $calls = Calls::whereIn('assigned_to', $usersArray)
                ->whereBetween('first_contact', [$startDate, $endDate])
                ->offset($off)->limit($limit)
                ->get();
        } else if ($type == 13) {
            $usersArray = explode(',', $users);
            $calls = Calls::whereIn('assigned_to', $usersArray)
                ->whereBetween('follow_up_date', [$startDate, $endDate])
                ->offset($off)->limit($limit)
                ->get();
        } else if ($type == 14) {
            $usersArray = explode(',', $users);
            $calls = Calls::whereIn('assigned_to', $usersArray)
                ->whereBetween('cancel_date', [$startDate, $endDate])
                ->offset($off)->limit($limit)
                ->get();
        } else {
            $usersArray = explode(',', $users);
            $calls = Calls::whereIn('assigned_to', $usersArray)
                ->where('status', $type)
                ->offset($off)->limit($limit)
                // ->whereBetween('created_at', array($startDate, $endDate))
                ->get();
        }




        return $this->sendResponse($calls, 'Retrieve calls.');
    }



    public function check($field, $value)
    {
        $input['email'] = $value;

        // Must not already exist in the `email` column of `users` table
        $rules = array('email' => 'required|email|regex:/(.+)@(.+)\.(.+)/i|unique:calls');

        $validator = Validator::make($input, $rules);

        if ($validator->fails()) {
            $call =  Calls::with('assigned_to')->withTrashed()->where('email', $input['email'])->first();
            return $this->sendError($validator->errors(), $call);
        } else {
            // Register the new user or whatever.
            return $this->sendResponse([], 'Email validate.');
        }
    }



    public function index()
    {
        //

        return $this->sendResponse($this->get_calls(), 'Calls Retrieve successfully.');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function register_api($data = array())
    {


        $endpoint = "https://onekeyclients.info/api/register_api";


        $response = Http::post($endpoint, $data);




        return   $data;
    }

    // private function extra_insert($data, $fields)
    // {

    //     if (count($fields) == 0) {
    //         return;
    //     }

    //     foreach ($fields as $value) {
    //         if (isset($data[$value])) {
    //             CallsExtra::create([
    //                 'call_id' => (int) $data['id'],
    //                 'field' => $value,
    //                 'value' => $data[$value],
    //             ]);
    //         }
    //     }
    // }

    private function delete_extra($call_id, $group)
    {
        $all = ExtraGroups::where(['call_id' => $call_id, 'groups' => $group])->get();
        foreach ($all as $child) {
            $parent = ExtraGroups::find($child->id);
            $parent->values()->forceDelete();
            $parent->forceDelete();
        }
    }


    private function extra_group($data, $group, $call_id)
    {
        if (count($data) == 0) {
            return;
        }
        //  return $data;
        $userid = Auth::id();

        $this->delete_extra($call_id, $group);


        // unset($data['created_at']);
        foreach ($data as $key => $groups) {




            $date = isset($groups['created_at']) ? $groups['created_at'] : '';
            $user_id = isset($groups['user_id']) ? $groups['user_id'] :  $userid;
            $ext = ExtraGroups::create(

                [
                    'call_id' => (int) $call_id,
                    'groups' => $group,
                    'user_id' => $user_id,
                    'created_at' => $date
                ]
            );
            // unset($groups['created_at']);
            foreach ($groups as $field => $val) {

                if ($field != 'created_at' && $field != 'user_id') {
                    ExtraValues::create([
                        'field' => $field,
                        'value' => $val,
                        'ext_id' => $ext->id
                    ]);
                }
            }
        }
    }




    private function extra_single($filed, $value, $user_id, $call_id, $call_user_id)
    {
        $user = Auth::user();
        if ($call_user_id == $user->id) {
        } else if ($value != '') {


            $this->create_call_extra($filed, $value, $user_id, $call_id);
        }


        // $input['call_id'] = (int) $call_id;
        // $input['field'] = $filed;
        // $input['value'] =  $value . $user_id;
        // $input['user_id'] =  $user->id;
        // CallsExtra::create($input);
    }


    private function assigned_to($assign_to, $old_assign, $call_id)
    {
        if ($assign_to != $old_assign) {

            $this->create_call_extra('assigned_to', 'Assign To', $assign_to, $call_id);

            $emp_content = 'You have assigned new call !';


            $this->create_notification(2, $emp_content, 0, $old_assign, $assign_to, (int)  $call_id);
        }
    }


    public function update_feedback(Request $n)
    {

        Calls::where('id', $n->id)
            ->update(['feedbacks' => null]);
        return $this->sendResponse($this->get_calls(), 'Feedback has been read');
    }



    private static function udiffAssoc(array $array1, array $array2, $user_id, $id)
    {


        $in = array();

        foreach ($array1 as $key => $value) {

            if (!is_array($value) && $key != "user_id") {
                $in[$key] =  $value;
            }
        }




        $checkDiff = function ($a, $b) use (&$checkDiff) {
            //return -1; 
            if (is_array($a) && is_array($b)) {
                // return array_udiff_assoc($a, $b, $checkDiff);
                return -1;
            } elseif (is_array($a)) {
                return -1;
            } elseif (is_array($b)) {
                return -1;
            } elseif ($a == $b) {
                return 0;
            } else {
                return -1;
                // return $a > $b ? 1 : -1;
            }
        };
        $diff = array_udiff_assoc($in, $array2, $checkDiff);

        if (count($diff) > 0) {



            $inp['data'] = json_encode($diff);
            $inp['user_id'] = $user_id;
            $inp['call_id'] = $id;
            CallHistory::create($inp);

            return  $inp;
        }
    }









    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $last = Calls::latest()->first();
        //
        $input = $request->all();

        //  return $this->sendResponse($input['my_step'][0]['created_at'], 3);


        if (isset($input['id'])) {
            $id =  $input['id'];

            $old_call = Calls::where('id', $id)->select('first_name', 'last_name', 'email', 'phone_number', 'assigned_to')->get();

            if (isset($old_call[0]->email) && $old_call[0]->email !== '') { // instructions on 21th / may /2024 whatsapp video 2 
                unset($input['email']);
            } else if ($input['email'] != '') {
                $messages = [
                    'unique' => 'taken',
                ];
                $validator = Validator::make($input, [
                    'email' => 'required|email|regex:/(.+)@(.+)\.(.+)/i|unique:calls',
                ],  $messages);
                if ($validator->fails()) {
                    $call =  Calls::withTrashed()->where('email', $input['email'])->first();
                    return $this->sendError($validator->errors(), $call);
                    //return $this->sendError('Validation Error.', $validator->errors());
                }
            }



            $arr_call = Calls::where('id', $id)->first()->toArray();

            $this->udiffAssoc($input, $arr_call, $input['user_id'], $id); // MAKE HISTORY

            if (isset($input['follow_up'])) {

                $follow = $input['follow_up'];
                $end = end($follow);

                if ((int) $end['f_results'] != 0) {

                    $input['follow_up_date'] = $end['follow_up_date'];
                    $input['follow_up_notes'] = $end['follow_up_notes'];

                    $input['results'] =  $end['f_results'];

                    $this->extra_group($input['follow_up'], 'follow_up',  $id);
                } else {
                    if (isset($input['f_results']) && (int) $input['f_results'] == 4) {
                        $input['results'] = 3;
                        // $input['sections'] = 17; // instruction 20/5/2023
                    } else if (isset($input['f_results']) && (int) $input['f_results'] == 2) {
                        $input['results'] = 2;
                    } else if (isset($input['f_results']) && $input['f_results'] != '1') {
                        $input['results'] = $input['f_results'];
                    }
                }
                unset($input['follow_up']);
            } else {
                if (isset($input['f_results']) && (int)  $input['f_results'] == 4) {
                    $input['results'] = 3;
                    // $input['sections'] = 17;
                } else if (isset($input['f_results']) && (int)  $input['f_results'] == 2) {
                    $input['results'] = 2;
                } else if (isset($input['f_results']) && $input['f_results'] != '1') {
                    $input['results'] = $input['f_results'];
                }
            }



            isset($input['assigned_to']) &&  $this->assigned_to((int)$input['assigned_to'], (int) $old_call[0]->assigned_to, (int) $id);

            if (isset($input['con_gpa'])) {
                $this->extra_group($input['con_gpa'], 'con_gpa',  $id);
                unset($input['con_gpa']);
            }

            if (isset($input['suppose'])) {
                $this->extra_group($input['suppose'], 'suppose', $id);
                unset($input['suppose']);
            }

            if (isset($input['my_step'])) {
                $this->extra_group($input['my_step'], 'my_step', $id);
                unset($input['my_step']);
            }






            if (isset($input['call_schedule'])) {
                $cs = $input['call_schedule'];
                $last_cs = end($cs);
                $input['call_schedule_date'] = $last_cs['date'];
                $input['call_schedule_time'] = $last_cs['time'];
                $this->extra_group($input['call_schedule'], 'call_schedule',  $id);

                unset($input['call_schedule']);
            }


            if (isset($input['feedbacks']) !== "" && isset($input['assigned_to'])) { // FEEDBACK INSERTED
                $this->extra_single('feedbacks', $input['feedbacks'], $input['user_id'], $input['id'], $input['assigned_to']);
            } else {
                unset($input['feedbacks']);
            }

            unset($input['user_id']);



            if (isset($input['results']) && $input['results'] == 4) {
                // $input['sections'] = 17;
                $input['results'] = 3;
            }



            if ($input['cancel_reason'] != '0') { //GO TO CANCEL
                $input['results'] = 1;
                //  $input['sort'] =  $last->sort + 1;  //COMMENTED ON 29.10.23 
            } else if ($input['cancel_reason'] == '0' && isset($input['results']) &&  $input['results'] == 1) {

                $input['cancel_reason'] =  10;
            }





            if (isset($input['results']) && $input['results'] == 2) {
                $this->register_api($old_call);
            }


            if (!isset($input['results']) || (int) $input['results'] == 0) {
                $input['results'] = 3;
            }

            // if (isset($input['cancel']) && $input['cancel'] == 'true') {
            //     $input['results'] = 1;
            // } else if (isset($input['cancel']) && $input['cancel'] == 'false') {
            //     unset($input['results']);

            // }


            // return $input;

            $data =  Calls::where('id', (int) $id)
                ->update($input);

            //  $this->extra_insert($input, array('note', 'last_status_notes'));
            return $this->sendResponse($this->get_calls(), 'Call Update successfully.');
        } else {


            if ($input['email'] != '') {

                $messages = [
                    'unique' => 'taken',
                ];
                $validator = Validator::make($input, [
                    'email' => 'required|email|regex:/(.+)@(.+)\.(.+)/i|unique:calls',
                ],  $messages);
                if ($validator->fails()) {
                    $call =  Calls::withTrashed()->where('email', $input['email'])->first();
                    return $this->sendError($validator->errors(), $call);
                    //return $this->sendError('Validation Error.', $validator->errors());
                }
            }


            if ($input['f_results'] == 4) {
                $input['results'] = 3;
                //  $input['sections'] = 5;
            }

            // $last =  Calls::orderBy('id', 'desc')->first();

            //  $input['sort'] =  $last->sort;

            // else if ($input['results'] == 3) {
            //     $input['sections'] = null;
            // }

            if (isset($input['call_schedule'])) {
                $cs = $input['call_schedule'];
                $last_cs = end($cs);
                $input['call_schedule_date'] = $last_cs['date'];
                $input['call_schedule_time'] = $last_cs['time'];
            }


            $n = Calls::create($input);

            Calls::where('id', $n->id)
                ->update(['sort' => $n->id]);


            $follow = $input['follow_up'];
            //unset($input['follow_up']);

            $end = end($follow);
            $input['follow_up_date'] = $end['follow_up_date'];
            $input['follow_up_notes'] = $end['follow_up_notes'];

            isset($input['follow_up']) &&  $this->extra_group($input['follow_up'], 'follow_up', $n->id);
            isset($input['con_gpa']) &&  $this->extra_group($input['con_gpa'], 'con_gpa',  $n->id);

            isset($input['call_schedule']) &&  $this->extra_group($input['call_schedule'], 'call_schedule',   $n->id);



            isset($input['suppose']) &&  $this->extra_group($input['suppose'], 'suppose', $n->id);
            isset($input['my_step']) &&  $this->extra_group($input['my_step'], 'my_step',  $n->id);

            if ($input['f_results'] == 2) {
                $input['results'] = 2;
                $this->register_api(Calls::where('id',  $n->id)->select('first_name', 'last_name', 'email', 'phone_number')->get());
            }


            return $this->sendResponse($this->get_calls(), $n->id);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {


        $user = Auth::user();

        //
        $call =  Calls::where('id', $id)->with(['extra.values', 'extra.user', 'versions.user', 'history.user.profile', 'goal', 'marital_status', 'want_to_study', 'assigned_to', 'applying_for', 'section', 'results', 'follow_up_call_results', 'priorities', 'statu', 'package', 'cancel_reason', 'user'])->first();
        // return $this->sendResponse($call, 'Single Call retrieve successfully.');

        if ($user->is_admin == 3 && isset($call->assigned_to) && $user->id == $call->assigned_to) {
            return $this->sendResponse($call, 'Single Call retrieve successfully.');
        } else if ($user->is_admin == 1 || $user->is_admin == 2) {
            return $this->sendResponse($call, 'Single Call retrieve successfully.');
        } else if ($user->is_admin == 4) {

            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
            $emp[] = $user->id;
            //  return $this->sendResponse($emp, 'Emp Call retrieve successfully.');
            if (isset($call->assigned_to) && in_array($call->assigned_to, $emp)) {
                return $this->sendResponse($call, 'Supervisor  Call retrieve successfully.');
            }
        }



        return $this->sendResponse(false, 'Single Call retrieve successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }



    public function calls_sorts()
    {

        $calls = Calls::all();

        foreach ($calls as $key => $value) {

            Calls::where('id', $value['id'])
                ->update(['sort' => $key]);
        }
    }



    public function calls_sort(Request $request)
    {

        if ($request->start == null || $request->end == null)   return $this->sendResponse($this->get_calls(), 'Calls short successfully.');




        $start = (int) $request->start;
        $end = (int) $request->end;


        if ($end >  $start) {
            $all = Calls::whereBetween('sort', [$start, $end])->orderBy('sort', 'ASC')->get();


            Calls::where('sort', $start)
                ->update(['sort' => $end]);

            $count =  count($all);

            $count = $count - 1;
            for ($i = $count; $i > -1; $i--) {
                $value = $all[$i];
                $end = $end - 1;
                $sort = (int) $value->sort;

                if ($sort == $start) {
                } else {
                    Calls::where('id', $value->id)
                        ->update(['sort' =>  $end]);
                }
            }


            // foreach ($all as $key => $value) {

            //     $sort = (int) $value->sort;

            //     if ($sort == $start) {
            //     } else {
            //         Calls::where('id', $value->id)
            //             ->update(['sort' =>  $end]);
            //     }
            // }




            // return $this->sendResponse($all, 'Calls  lower short successfully.');
        } else {
            $all = Calls::whereBetween('sort', [$end, $start])->orderBy('sort', 'ASC')->get(); // here start is big and start > end

            Calls::where('sort', $start)
                ->update(['sort' => $end]);
            foreach ($all as $key => $value) {
                $end = $end + 1;
                $sort = (int) $value->sort;

                if ($sort == $start) {
                } else {
                    Calls::where('id', $value->id)
                        ->update(['sort' =>  $end]);
                }
            }

            // return $this->sendResponse($all, 'Calls upper  short successfully.');
        }


        // foreach ($all as $key => $value) {


        // }



        return $this->sendResponse($this->get_calls(), 'Calls short successfully.');
    }




    public function call_single(Request $request, $id)
    {

        $call = Calls::find($id);

        $this->extra_single($request->name, $call->{$request->name}, $request->user_id, $id, $call->assigned_to);


        $call->{$request->name} = $request->value;

        $call->save();


        $data = Calls::updateOrCreate(
            ['id' =>  (int) $id],
            [$request->name => $request->value]
        );

        // $filed, $value, $user_id, $call_id)

        return $this->sendResponse($this->get_calls(), 'Update Call successfully.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    private function get_noti()
    {
        $user = Auth::user();

        if ($user->is_admin == 1 || $user->is_admin == 2) {
            return Notifications::where('to_id', $user->id)->orWhere('to_id', null)->with(['types', 'user', 'receiver', 'admin'])->orderBy('id', 'DESC')->get();
        } else {
            return Notifications::where('to_id', $user->id)->with(['types', 'user', 'receiver', 'admin'])->orderBy('id', 'DESC')->get();
        }
    }

    private function create_notification($type, $content, $is_read, $sender, $receiver, $call_id)
    {
        $input['type'] = $type;
        $input['content'] = $content; //  $calls->email . ' Transferred to you successfully !';

        $input['is_read'] = $is_read;

        $input['user_id'] = $sender;

        $input['to_id'] = $receiver;
        $input['call_id'] = $call_id;

        Notifications::firstOrCreate($input);
    }


    private function update_notification($noti_id, $admin_content, $note, $admin_id, $approve)
    {

        Notifications::where('id', (int)  $noti_id)->update(['is_read' => 1, 'content' => $admin_content, 'note' => $note, 'admin_id' => $admin_id, 'approve' => $approve]);
    }




    public function update(Request $request, $id)
    {

        if ($id == 0) {
            if ($request->name == 'results' && $request->value == '4') { // when no answer selected its will go no answer section
                Calls::whereIn('id', $request->ids)
                    ->update(['sections' => 5]);
            } else  if ($request->name == 'results' && $request->value == '3') { // when no answer selected its will go no open section
                //   return 'update nn';
                Calls::whereIn('id', $request->ids)
                    ->update(['sections' => null, 'cancel_reason' => null, 'cancel_date' => null, 'cancel_note' => null, 'results' => 3]);
                foreach ($request->ids as $call_id) {
                    $ext = ExtraGroups::create([
                        'call_id' => (int) $call_id,
                        'groups' => 'follow_up'
                    ]);
                    ExtraValues::create([
                        'field' => 'follow_up_date',
                        'value' => date("Y-m-d"),
                        'ext_id' => $ext->id
                    ]);
                    ExtraValues::create([
                        'field' => 'f_results',
                        'value' => 3,
                        'ext_id' => $ext->id
                    ]);
                    ExtraValues::create([
                        'field' => 'follow_up_notes',
                        'value' => '',
                        'ext_id' => $ext->id
                    ]);
                }
            } else  if ($request->name == 'results' && (int) $request->value == 2) { // when no answer selected its will go no answer section
                Calls::whereIn('id', $request->ids)
                    ->update(['sections' => null, 'results' => 2]);
                $this->register_api(Calls::whereIn('id', $request->ids)->select('first_name', 'last_name', 'email', 'phone_number')->get());
            } else {
                Calls::whereIn('id', $request->ids)->update([$request->name => $request->value]);
            }

            if ($request->name == 'results') {
                Calls::whereIn('id', $request->ids)
                    ->update(['f_results' => $request->value]);
            }



            return $this->sendResponse($this->get_calls(), 'Bulk Update Call successfully.');
        } else {
            $call = Calls::find($id);
            if ($request->type == 2) {
                $input['call_id'] = (int) $id;
                $input['field'] = $request->name;
                $input['value'] =  $call[$request->name];
                CallsExtra::create($input);
            } else if ($request->type == 3) {
                $user = Auth::user();
                $this->create_call_extra('assigned_to', 'Assigned from notification', $request->user_id, (int) $id);


                Calls::withTrashed()->where('id', (int)  $id)
                    ->update([$request->name => $request->value, 'assigned_to' => $request->user_id, 'sections' => null, 'results' => 3, 'assigned_date' => date("Y-m-d H:i:s")]);

                $calls = Calls::find((int) $id);


                $emp_content = $calls->email . ' Transferred to you successfully !';
                $admin_content = 'The transfer was done successfully';

                $this->create_notification(3, $emp_content, 0, $user->id, $request->user_id, (int)  $id); //emp_notification

                //  $this->create_notification(3, $admin_content, 0, $request->user_id, $user->id, (int)  $id); //admin_notification

                $this->update_notification($request->noti_id, $admin_content, $request->note, $request->admin_id, $request->approve);

                return $this->sendResponse(array('noti' => $this->get_noti(), 'call' => Calls::withTrashed()->with(['user'])->where('id', (int) $id)->first()), 'Notifications updated  successfully.');
            } else  if ($request->name == 'results' && $request->value == '3') { // when no answer selected its will go no answer section
                Calls::where('id', (int)  $id)
                    ->update(['sections' => null, 'cancel_reason' => null, 'cancel_date' => null, 'cancel_note' => null, 'results' => 3]);
            } else {

                if ($request->name == 'results' && $request->value == '4') { // when no answer selected its will go no answer section
                    // Calls::withTrashed()->where('id', (int)  $id)
                    //     ->update(['sections' => 5]);
                } else {
                    Calls::withTrashed()->where('id', (int)  $id)
                        ->update([$request->name => $request->value]);
                }
            }


            if ($request->name == 'results' && $request->value == '2') {
                //  $this->register_api(Calls::whereIn('id', $request->ids)->get());

                $this->register_api(Calls::where('id', $id)->select('first_name', 'last_name', 'email', 'phone_number')->get());
            }

            return $this->sendResponse($this->get_calls(), 'Update Call successfully.');
        }

        //

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        //

        //Calls::find($id)->forceDelete();

        Calls::whereIn('id', $request->all())->forceDelete();

        return $this->sendResponse($this->get_calls(), 'Call deleted successfully.');
    }


    public function events()
    {
        $user = Auth::user();

        // if ($user->is_admin == 3) {
        //     $call_ids = Calls::where('user_id', $user->id)->pluck('id')
        //         ->toArray();

        //     $call =  ExtraGroups::whereIn('call_id',  $call_ids)->with(['values', 'calls'])->get();
        // } else {
        //     $call =  ExtraGroups::with(['values', 'calls'])->get();
        // }
        // // $calls =  Calls::where('user_id', $user->id)->get(['id', 'follow_up_date', 'first_name', 'last_name', 'memo']);
        // return $this->sendResponse($call, 'Events Retrieve successfully.');
        if ($user->is_admin == 4) {

            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;

            $emp[] = $user->id;

            $call_ids['next'] = Calls::WhereIn('assigned_to', $emp)->with('steps.next')->get(['id', 'first_name', 'last_name', 'assigned_to']);

            // $call_ids['csd'] = Calls::WhereIn('assigned_to', $emp)->where('call_schedule_date', '!=', null)->get(['id', 'first_name', 'last_name', 'call_schedule_date', 'call_schedule_time as cst', 'assigned_to']);

            $call_ids['csd'] =  Calls::WhereIn('assigned_to', $emp)
                ->where(function ($q) {
                    $q->where('call_schedule_date', '!=', null);
                })
                ->get(['id', 'first_name', 'last_name', 'call_schedule_date', 'call_schedule_time as cst', 'assigned_to']);
        } else if ($user->is_admin == 3) {

            //$call_ids['follow_up_date'] = Calls::where('user_id', $user->id)->get(['id', 'first_name', 'last_name', 'follow_up_date', 'call_schedule_date']);

            //  $call_ids['fud'] = Calls::where([['assigned_to', '=', $user->id], ['follow_up_date', '!=', null]])->get(['id', 'first_name', 'last_name', 'follow_up_date', 'call_schedule_time as cst']);


            $call_ids['next'] = Calls::with('steps.next')->where('assigned_to', $user->id)->get(['id', 'first_name', 'last_name']);



            $call_ids['csd'] = Calls::where([['assigned_to', '=', $user->id], ['call_schedule_date', '!=', null]])->get(['id', 'first_name', 'last_name', 'call_schedule_date', 'call_schedule_time as cst']);
        } else {
            // $call_ids['fud'] = Calls::where('follow_up_date', '!=', null)->get(['id', 'first_name', 'last_name', 'follow_up_date']);

            $call_ids['next'] = Calls::with('steps.next')->where('assigned_to', $user->id)->get(['id', 'first_name', 'last_name', 'assigned_to']);
            $call_ids['csd'] = Calls::where('call_schedule_date', '!=', null)->get(['id', 'first_name', 'last_name', 'call_schedule_date', 'assigned_to']);
        }

        return $this->sendResponse($call_ids, 'Events Retrieve successfully.');
    }


    public function call_export(Request $request)
    {
        $calls = Calls::with('extra.values', 'assignedTo', 'cancelReason')->where('results', 1)->offset(1)->limit(1)->get()->groupBy('sections');
        // print_r($calls);
        return view('call_view', [
            'calls' => $calls,
            'section' => Sections::all(),
            'package' => Package::all(),
            'status' => Status::all(),

        ]);
        return $this->sendResponse($calls, 'call Export successfully.');
    }

    public function import_file(Request $request)
    {
        $file_name = $request->file('file')->getClientOriginalName();
        $file =  $request->file('file')->store('files');

        return $this->sendResponse(array($file, $file_name), 'File Imported successfully.');
    }


    public function import(Request $request)
    {

        if ($request->user_id !== 0) {

            $file_name = $this->clean($request->file_name);

            Excel::import(
                new CallImport($request->user_id, $file_name),
                $request->file_path
            );


            return $this->sendResponse([], 'File Imported successfully.');
        }
    }

    public function singleImport(Request $request)
    {

        if ($request->user_id !== 0) {

            $file_name = $this->clean($request->file_name);

            Excel::import(
                new SingleSheetImport($request->user_id, $request->file_name, $request->type),
                $request->file_path
            );


            return $this->sendResponse([], 'File Imported successfully.');
        }
    }
}
