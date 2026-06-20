<script setup>
import DashboardLayout from "../../layouts/DashboardLayout.vue";
</script>

<template>
  <DashboardLayout>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">

      <div class="col-12 col-md-4">
        <div class="card shadow-sm border-0 bg-primary text-white">
          <div class="card-body">
            <h6>Total Members</h6>
            <h2>120</h2>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card shadow-sm border-0 bg-success text-white">
          <div class="card-body">
            <h6>Total Savings</h6>
            <h2>5.2M TZS</h2>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card shadow-sm border-0 bg-warning text-dark">
          <div class="card-body">
            <h6>Active Loans</h6>
            <h2>32</h2>
          </div>
        </div>
      </div>

    </div>

    <!-- TABLE -->
    <div class="card shadow-sm border-0">

      <div class="card-header bg-white">
        <h5 class="mb-0">Recent Members</h5>
      </div>

      <div class="table-responsive">

        <table class="table table-hover mb-0">

          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>John Mushi</td>
              <td>0712345678</td>
              <td>
                <span class="badge bg-success">Active</span>
              </td>
            </tr>

            <tr>
              <td>Asha Mohamed</td>
              <td>0789123456</td>
              <td>
                <span class="badge bg-success">Active</span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </DashboardLayout>
</template>