<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAssignEmpTable extends Migration {

	public function up()
	{
		Schema::create('assign_emp', function(Blueprint $table) {
			$table->increments('id');
			$table->bigInteger('user_id');
			$table->bigInteger('admin_id');
			$table->timestamps();
			$table->softDeletes();
		});
	}

	public function down()
	{
		Schema::drop('assign_emp');
	}
}